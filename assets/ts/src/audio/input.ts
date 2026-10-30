// ╭───────────────────────────────────────────────────────────────╮
// │        Audio input: the microphone, a test tone, or a file        │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the audio tools. A page has these elements, with IDs that start with its prefix
// (for example, "ft-source"):
//   -source         <select> of "mic", "tone", and "file"
//   -start          button that enables the microphone
//   -freeze         button that freezes the graphs
//   -status         status line
//   -tone-controls  the test tone's controls, shown when the input is the test tone
//   -tone-play      the test tone's play/stop button
//   -file-controls  the audio file's controls, shown when the input is an audio file
//   -file           <input type="file">
//   -audio          <audio> player for the file
// Every source is connected to `input`, a gain node that the page analyzes. The page makes its
// own test tone, since each page's tone has different options.

export interface AudioInputHooks {
  // Called once, when the audio context is created, to connect the page's analysis to `input`.
  onContext(ctx: AudioContext, input: AudioNode): void;
  // Starts the test tone, connected to `input`, and returns a function that stops it.
  startTone(ctx: AudioContext, input: AudioNode): () => void;
}

export class AudioInput {
  ctx  : AudioContext | null = null;
  input: GainNode | null = null;
  frozen = false;

  readonly sourceSelect  : HTMLSelectElement;
  readonly audioElement  : HTMLAudioElement;
  private readonly startButton   : HTMLButtonElement;
  private readonly tonePlayButton: HTMLButtonElement;
  private readonly freezeButton  : HTMLButtonElement;
  private readonly statusLine    : HTMLParagraphElement;
  private readonly toneControls  : HTMLElement;
  private readonly fileControls  : HTMLElement;
  private readonly fileInput     : HTMLInputElement;
  private stopSource: (() => void) | null = null;
  private mediaNode : MediaElementAudioSourceNode | null = null;

  constructor(prefix: string, private readonly hooks: AudioInputHooks) {
    const $ = <T extends HTMLElement>(id: string) => document.getElementById(`${prefix}-${id}`) as T;
    this.sourceSelect   = $("source");
    this.startButton    = $("start");
    this.tonePlayButton = $("tone-play");
    this.freezeButton   = $("freeze");
    this.statusLine     = $("status");
    this.toneControls   = $("tone-controls");
    this.fileControls   = $("file-controls");
    this.fileInput      = $("file");
    this.audioElement   = $("audio");

    this.sourceSelect.addEventListener("change", () => {
      this.stop();
      this.setStatus("");
      // Only an audio file that's paused stays frozen (the Freeze button is only shown for the
      // microphone).
      this.setFrozen(this.source === "file" && !!this.audioElement.src && this.audioElement.paused);
      this.showSourceControls();
      if (this.source === "file" && this.audioElement.src) this.connectFile();
      if (this.source === "mic") void this.autoStartMicrophone(); // No button needed if it's allowed already
    });

    this.startButton.addEventListener("click", () => void this.startMicrophone());
    this.tonePlayButton.addEventListener("click", () => {
      if (this.stopSource) this.stop();
      else this.startTone();
    });

    this.fileInput.addEventListener("change", () => {
      const file = this.fileInput.files?.[0];
      if (!file) return;
      if (this.audioElement.src) URL.revokeObjectURL(this.audioElement.src);
      this.audioElement.src = URL.createObjectURL(file);
      this.audioElement.hidden = false;
      if (!this.stopSource) this.connectFile();
      void this.audioElement.play();
    });
    this.audioElement.addEventListener("play", () => {
      void this.ctx?.resume();
      if (!this.stopSource) this.connectFile();
    });

    this.freezeButton.addEventListener("click", () => this.setFrozen(!this.frozen));
    // Pausing an audio file freezes everything, and playing it again resumes.
    for (const event of ["pause", "play"]) {
      this.audioElement.addEventListener(event, () => {
        if (this.source === "file") this.setFrozen(event === "pause");
      });
    }
  }

  get source(): string { return this.sourceSelect.value; }
  get running(): boolean { return !!this.stopSource; }

  ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.input = this.ctx.createGain();
      this.hooks.onContext(this.ctx, this.input);
    }
    void this.ctx.resume();
    return this.ctx;
  }

  setStatus(message: string, kind: "error" | "info" = "error"): void {
    this.statusLine.textContent = message;
    this.statusLine.hidden = !message;
    this.statusLine.classList.toggle(`${this.statusLine.id}-info`, kind === "info");
  }

  get status(): string { return this.statusLine.textContent ?? ""; }

  setFrozen(value: boolean): void {
    this.frozen = value;
    this.freezeButton.textContent = value ? "▶ Resume" : "❚❚ Freeze";
    this.freezeButton.setAttribute("aria-pressed", String(value));
  }

  stop(): void {
    this.stopSource?.();
    this.stopSource = null;
    this.updateSourceButtons();
  }

  // Restarts the test tone if it's playing, as when its options change.
  restartTone(): void {
    if (this.stopSource && this.source === "tone") {
      this.stop();
      this.startTone();
    }
  }

  // Shows the controls for the chosen input. Call once the page's controls are restored.
  showSourceControls(): void {
    const source = this.source;
    this.toneControls.hidden = source !== "tone";
    this.fileControls.hidden = source !== "file";
    this.updateSourceButtons();
  }

  // The microphone's button is only needed until the microphone is listening, which usually means
  // asking for permission to use it. The test tone has its own play/stop button, and an audio file
  // has the audio player's controls (and freezes the graphs when it's paused), so the Freeze button
  // is only for the microphone.
  private updateSourceButtons(): void {
    const source = this.source, running = !!this.stopSource;
    this.startButton.hidden = source !== "mic" || running;
    this.freezeButton.hidden = source !== "mic";
    this.tonePlayButton.textContent = running && source === "tone" ? "■ Stop" : "▶ Play";
  }

  async startMicrophone(): Promise<void> {
    const ctx = this.ensureContext();
    if (!navigator.mediaDevices?.getUserMedia) {
      this.setStatus("This browser doesn't allow microphone access on this page.");
      return;
    }
    try {
      // Echo cancellation and noise suppression are designed for speech and would distort the spectrum.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const node = ctx.createMediaStreamSource(stream);
      node.connect(this.input!);
      this.stopSource = () => {
        node.disconnect();
        stream.getTracks().forEach(track => track.stop());
      };
      this.updateSourceButtons();
      this.setStatus("");
      this.resumeWhenAllowed(ctx);
    } catch (err) {
      this.setStatus(`Couldn't open the microphone (${(err as Error).message}).`);
    }
  }

  // Starts listening right away for visitors who have already allowed this page to use the
  // microphone (and who were using the microphone last time).
  async autoStartMicrophone(): Promise<void> {
    if (this.source !== "mic") return;
    try {
      const permission = await navigator.permissions.query({ name: "microphone" as PermissionName });
      if (permission.state === "granted" && !this.stopSource) await this.startMicrophone();
    } catch { /* The browser can't report whether the microphone is allowed */ }
  }

  // Browsers may keep audio paused until the visitor interacts with the page, which happens when
  // the microphone starts without a click. Listening then begins on the first click or key press.
  private resumeWhenAllowed(ctx: AudioContext): void {
    setTimeout(() => {
      if (ctx.state === "running") return;
      this.setStatus("Click anywhere on the page to start listening.", "info");
      const resume = () => {
        void ctx.resume().then(() => this.setStatus(""));
        document.removeEventListener("pointerdown", resume);
        document.removeEventListener("keydown", resume);
      };
      document.addEventListener("pointerdown", resume);
      document.addEventListener("keydown", resume);
    }, 500);
  }

  private startTone(): void {
    const ctx = this.ensureContext();
    this.stopSource = this.hooks.startTone(ctx, this.input!);
    this.updateSourceButtons();
  }

  private connectFile(): void {
    const ctx = this.ensureContext();
    if (!this.mediaNode) {
      this.mediaNode = ctx.createMediaElementSource(this.audioElement);
      this.mediaNode.connect(ctx.destination);
    }
    this.mediaNode.connect(this.input!);
    this.stopSource = () => {
      this.audioElement.pause();
      this.mediaNode!.disconnect(this.input!);
    };
  }
}
