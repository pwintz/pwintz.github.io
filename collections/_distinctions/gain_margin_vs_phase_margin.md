---
published: false
title: Gain margin vs. phase margin
kind: siblings
areas: [control]
status: draft
summary: >
  The gain margin is how much the loop gain can grow before instability. The phase margin is how much extra phase lag, such as from a time delay, the loop can tolerate.
  They are measured at different frequencies, and neither one alone guarantees robustness.
terms:
  - gain_margin
  - phase_margin
see_also:
  - types_stability_criterion
  - poles_vs_eigenvalues_vs_zeros
---
## Examples

The closed loop $1 + L(s) = 0$ with $L(s) = \frac{K}{(s + 1)^3}$ is stable exactly when $K < 8$ (by the Routh–Hurwitz criterion). The phase of $L$ reaches $-180^{\circ}$ at $\omega_{p} = \sqrt{3}$, where $\lvert L \rvert = K / 8$.

| Open loop $L(s)$ | Gain margin | Phase margin | Closed loop |
| --- | --- | --- | --- |
| $\frac{1}{s + 1}$ | infinite | $180^{\circ}$ | stable |
| $\frac{2}{(s + 1)^3}$ | $4$ (about $12$ dB) | about $68^{\circ}$ | stable |
| $\frac{8}{(s + 1)^3}$ | $1$ ($0$ dB) | $0^{\circ}$ | marginally stable (it oscillates) |
| $\frac{10}{(s + 1)^3}$ | $0.8$ (about $-1.9$ dB) | about $-7^{\circ}$ | unstable |

For $L(s) = \frac{2}{(s + 1)^3}$, the gain crossover frequency is $\omega_{g} \approx 0.77$, so the delay margin is about $1.18 / 0.77 \approx 1.5$ seconds.

## Notes

- The gain margin is read where the phase is $-180^{\circ}$, and the phase margin is read where the magnitude is $1$. These are different frequencies.
- Large gain and phase margins do not rule out a Nyquist plot that passes close to $-1$ at some other frequency. The distance from the Nyquist plot to $-1$, which is the reciprocal of the peak of the sensitivity function, is a more reliable measure of robustness.
- Typical design targets are a gain margin of at least $2$ ($6$ dB) and a phase margin of $30^{\circ}$ to $60^{\circ}$.
