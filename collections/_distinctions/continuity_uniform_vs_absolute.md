---
published: false
title: Uniformly continuous vs. absolutely continuous
kind: hierarchy
areas: [analysis]
status: draft
summary: >
  Uniform continuity controls how much $f$ changes over one short interval.
  Absolute continuity controls the total change of $f$ over many short intervals at once.
relation: absolutely continuous ⊂ uniformly continuous
terms:
  - uniformly_continuous
  - absolutely_continuous
examples:
  - example: the_cantor_function_on_0_1
    why: >-
      It rises from $0$ to $1$, but its derivative is $0$ almost everywhere, so it is not the integral of its derivative.
  - example: f_x_eq_x_sin_1_x_for_x_neq_0_f_0_eq_0_on_0_1
    why: >-
      Its total variation is infinite, but every absolutely continuous function has finite total variation. ([source](https://en.wikipedia.org/wiki/Absolute_continuity#Examples))
  - example: x_to_sqrt_x_on_0_1
    why: >-
      It equals $\int_0^x \frac{1}{2 \sqrt{t}} \mathrm{d}t$, and $t \mapsto \frac{1}{2 \sqrt{t}}$ is integrable on $[0, 1]$.
see_also:
  - types_of_continuous
  - continuous_vs_uniform_continuous
  - continuity_absolute_vs_Lipschitz
---
## Notes

- Every continuous function on a compact interval $[a, b]$ is uniformly continuous, so on $[a, b]$ this is also the distinction between continuous and absolutely continuous functions.
- Taking $n = 1$ in the definition of absolute continuity gives the definition of uniform continuity, which is why every absolutely continuous function is uniformly continuous.
