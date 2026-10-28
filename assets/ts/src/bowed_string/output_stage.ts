import type { BowedString } from "./string_model";

// Turns the bridge's displacement into audio samples, for both the live sound and the "Listen"
// clips. The gain is fixed, so the volume follows the size of the bridge's motion. Only motion too
// large to play without clipping is turned down, by a limiter.

const HIGH_PASS = 20;        // Cutoff of the filter that removes the bridge's steady offset (Hz)
const GAIN = 0.25 / 2e-6;    // Output per meter: the default bridge's ±2 µm plays at a quarter of full scale
const CEILING = 0.9;         // Highest output level
const LIMIT_RELEASE = 0.3;   // Time for the limiter to let go after a loud passage (s)

export class OutputStage {
  private readonly a: number;
  private readonly release: number;
  private prevIn = 0;
  private prevOut = 0;
  private peak = 0;          // Recent peak of the amplified signal, for the limiter

  constructor(sampleRate: number) {
    this.a = 1 / (1 + 2 * Math.PI * HIGH_PASS / sampleRate);
    this.release = Math.exp(-1 / (LIMIT_RELEASE * sampleRate));
  }

  // One sample, from the bridge's displacement (m).
  process(displacement: number): number {
    this.prevOut = this.a * (this.prevOut + displacement - this.prevIn);
    this.prevIn = displacement;
    const x = GAIN * this.prevOut;
    // Follows peaks at once, so nothing gets through above the ceiling.
    this.peak = Math.max(Math.abs(x), this.peak * this.release);
    return this.peak > CEILING ? x * CEILING / this.peak : x;
  }
}

// Steps a string in time with an audio clock, one output sample at a time. When several steps
// fall within a sample, their displacements are averaged; when a step is longer than a sample (a
// low string), the displacement is interpolated between steps.
export class SoundSource {
  private readonly stage: OutputStage;
  private ahead = 0;   // How far the string's time is ahead of the output's (s)
  private prev = 0;    // Bridge displacement at the step before last
  private current = 0; // ... and at the last step

  constructor(readonly sim: BowedString, private readonly sampleRate: number) {
    this.stage = new OutputStage(sampleRate);
  }

  next(): number {
    const sim = this.sim;
    let sum = 0, count = 0;
    this.ahead -= 1 / this.sampleRate;
    while (this.ahead < 0) {
      sim.step();
      this.ahead += sim.dt;
      this.prev = this.current;
      this.current = sim.bridgeDisplacement;
      sum += this.current;
      count++;
    }
    const x = count > 0 ? sum / count : this.current - (this.current - this.prev) * this.ahead / sim.dt;
    return this.stage.process(x);
  }
}
