// ╭───────────────────────────────────────────────────────────────╮
// │                 Gapless capture of audio samples                 │
// ╰───────────────────────────────────────────────────────────────╯
// An AnalyserNode only shows the most recent samples whenever it's asked, which misses the fast
// changes at the start of a note. Instead, an AudioWorklet sends every sample (mixed to mono) to
// the page, where they're kept in a ring buffer for the analysis to read in small steps.

const BLOCK = 1024;     // Samples the worklet collects before sending them (about 20 ms)
const HIGH_PASS_HZ = 30; // Lower frequencies are removed before the analysis

// The worklet runs in the audio thread, so it's loaded from its own source, as a Blob URL.
const WORKLET_SOURCE = `
class NoteQualityTap extends AudioWorkletProcessor {
  constructor() {
    super();
    this.block = new Float32Array(${BLOCK});
    this.filled = 0;
  }
  process(inputs) {
    // With nothing connected (as after the test tone stops), the input is silence, which is
    // recorded too, so that time keeps passing for the analysis.
    const channels = inputs[0] || [];
    const n = channels.length ? channels[0].length : 128, scale = 1 / Math.max(1, channels.length);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (const channel of channels) sum += channel[i];
      this.block[this.filled++] = sum * scale;
      if (this.filled === this.block.length) {
        this.port.postMessage(this.block);
        this.block = new Float32Array(${BLOCK});
        this.filled = 0;
      }
    }
    return true;
  }
}
registerProcessor("note-quality-tap", NoteQualityTap);
`;

export class SampleBuffer {
  readonly capacity: number;
  private readonly data: Float32Array;
  total = 0; // Samples written so far; sample i is kept until sample i + capacity is written

  constructor(capacity: number) {
    this.capacity = capacity;
    this.data = new Float32Array(capacity);
  }

  write(block: Float32Array): void {
    for (let i = 0; i < block.length; i++) this.data[(this.total + i) % this.capacity] = block[i];
    this.total += block.length;
  }

  // Copies the `out.length` samples that end just before sample `end` into `out`.
  read(end: number, out: Float32Array | Float64Array): void {
    const start = end - out.length;
    for (let i = 0; i < out.length; i++) out[i] = this.data[(start + i) % this.capacity];
  }

  // Whether the samples from `start` up to `end` are all still in the buffer.
  holds(start: number, end: number): boolean {
    return start >= 0 && start >= this.total - this.capacity && end <= this.total;
  }
}

// Connects a capture worklet to `source` and writes its samples to `buffer`. Resolves once the
// worklet is running, or rejects if the browser can't run it.
export async function startCapture(ctx: AudioContext, source: AudioNode, buffer: SampleBuffer): Promise<void> {
  const url = URL.createObjectURL(new Blob([WORKLET_SOURCE], { type: "text/javascript" }));
  try {
    await ctx.audioWorklet.addModule(url);
  } finally {
    URL.revokeObjectURL(url);
  }
  const tap = new AudioWorkletNode(ctx, "note-quality-tap", { numberOfInputs: 1, numberOfOutputs: 1 });
  tap.port.onmessage = (e: MessageEvent<Float32Array>) => buffer.write(e.data);
  // Some microphones add a constant offset (DC) or a sub-audio rumble, which would swamp the
  // level of the sound, so frequencies far below the lowest notes are filtered out first.
  const highPass = ctx.createBiquadFilter();
  highPass.type = "highpass";
  highPass.frequency.value = HIGH_PASS_HZ;
  source.connect(highPass).connect(tap);
  // Some browsers only process nodes that lead to the output, so the worklet feeds a silent gain.
  const sink = ctx.createGain();
  sink.gain.value = 0;
  tap.connect(sink).connect(ctx.destination);
}
