// ╭───────────────────────────────────────────────────────────────╮
// │          Live sound of the bowed string (AudioWorklet)        │
// ╰───────────────────────────────────────────────────────────────╯
// Runs its own copy of the string model (bowed_string/string_model.ts) in real time on the audio
// thread and plays the bridge's displacement, at a fixed gain (see bowed_string/output_stage.ts).
// The page sends it the settings whenever they change. Whatever changes, the string carries on from
// its current motion with the new settings, as a real string would; only "bow" (from rest) and
// "pluck" start it over.

import { SoundSource } from "./bowed_string/output_stage";
import { BowSettings, BowedString, BridgeSettings, StringSpec } from "./bowed_string/string_model";

// The parts of the AudioWorklet global scope that this file uses.
declare const sampleRate: number;
declare function registerProcessor(name: string, processor: new () => AudioWorkletProcessor): void;
declare class AudioWorkletProcessor {
  readonly port: MessagePort;
}

export interface LiveSettings {
  string : StringSpec;
  bow    : BowSettings;
  bridge : BridgeSettings;
}

export type LiveMessage =
  | { type: "settings"; settings: LiveSettings }
  | { type: "bow" }                                  // Start bowing from rest
  | { type: "bowOn" }                                // Put the bow on the string as it is
  | { type: "pluck"; at: number; height: number }
  | { type: "pause" }
  | { type: "resume" };

class BowedStringProcessor extends AudioWorkletProcessor {
  private source: SoundSource | null = null;
  private bow: BowSettings = { force: 0, speed: 0, position: 0.1, muStatic: 0.8, muDynamic: 0.3 };
  private bridge: BridgeSettings = { stiffness: 1, damping: 1 };
  private paused = false;

  constructor() {
    super();
    this.port.onmessage = (event: MessageEvent<LiveMessage>) => this.receive(event.data);
  }

  private receive(message: LiveMessage): void {
    switch (message.type) {
      case "settings": {
        const { string, bow, bridge } = message.settings;
        // The string holds these objects, so updating them in place changes its bowing and bridge.
        Object.assign(this.bow, bow);
        Object.assign(this.bridge, bridge);
        // The string is created with the first settings, and retuned in place after that (so
        // sliding the finger, for example, plays a glissando).
        if (this.source) this.source.sim.retune(string);
        else this.source = new SoundSource(new BowedString(string, this.bow, this.bridge), sampleRate);
        break;
      }
      case "bow":
        if (this.source) {
          this.source.sim.reset();
          this.source.sim.bowing = true;
        }
        break;
      case "bowOn":
        this.source?.sim.startBowing();
        break;
      case "pluck":
        this.source?.sim.pluck(message.at, message.height);
        break;
      case "pause":
        this.paused = true;
        break;
      case "resume":
        this.paused = false;
        break;
    }
  }

  process(_inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
    const out = outputs[0][0];
    const source = this.source;
    if (!source || this.paused) {
      out.fill(0);
      return true;
    }
    for (let i = 0; i < out.length; i++) out[i] = source.next();
    for (let c = 1; c < outputs[0].length; c++) outputs[0][c].set(out);
    return true;
  }
}

registerProcessor("bowed-string", BowedStringProcessor);
