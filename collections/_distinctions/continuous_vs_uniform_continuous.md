---
published: false
title: Continuous vs. uniformly continuous
kind: hierarchy
areas: [analysis]
status: draft
summary: >
  Continuity says that small changes in input cause small changes in output, and uniform continuity asks for this at the same scale everywhere.
  A continuous function may need a smaller $\delta$ at some points than at others.
  A uniformly continuous function has one $\delta$ that works everywhere.
relation: uniformly continuous ⊂ continuous
terms:
  - continuous
  - uniformly_continuous
examples:
  - example: square_on_reals
    why: >-
      $x \mapsto x^2$ is continuous.
      It is not uniformly continuous, because its graph gets steeper as $\lvert x \rvert$ grows, so the $\delta$ needed for a fixed $\varepsilon$ shrinks toward $0$.
  - example: x_to_e_x_on_reals
    why: >-
      $x \mapsto e^x$ is continuous.
      It is not uniformly continuous, because its graph gets steeper without bound as $x$ increases.
  - example: x_to_tan_x_on_minus_pi_2_pi_2
    why: >-
      $\tan$ is continuous on $(-\pi/2, \pi/2)$.
      It is not uniformly continuous there, because its graph gets steeper without bound near the ends of the interval.
  - example: x_to_sin_1_x_on_0_infinity
    why: >-
      $x \mapsto \sin(1/x)$ is continuous on $(0, \infty)$.
      It is not uniformly continuous, because it oscillates between $-1$ and $1$ faster and faster as $x \to 0$.
  - example: x_to_sin_x_on_reals
    why: >-
      $\sin$ is uniformly continuous, and so continuous, because $\lvert \sin(x) - \sin(y) \rvert \leq \lvert x - y \rvert$, so the choice $\delta = \varepsilon$ works everywhere.
  - example: x_to_sqrt_x_on_0_infinity
    why: >-
      $x \mapsto \sqrt{x}$ is uniformly continuous, and so continuous, because $\lvert \sqrt{x} - \sqrt{y} \rvert \leq \sqrt{\lvert x - y \rvert}$, so the choice $\delta = \varepsilon^2$ works everywhere.
  - example: x_to_x_squared_on_0_1
    why: >-
      $x \mapsto x^2$ on $[0, 1]$ is continuous.
      It is uniformly continuous because every continuous function on a compact set is uniformly continuous.
see_also:
  - types_of_continuous
  - continuity_uniform_vs_absolute
---
## Notes

- Every uniformly continuous function is continuous (as the name suggests), but some continuous functions are not uniformly continuous.
- Uniform continuity is defined for functions between metric spaces (or, more generally, uniform spaces), whereas continuity is defined for functions between any topological spaces.
- To distinguish continuity from uniform continuity, the former is sometimes called "ordinary continuity" or "pointwise continuity."
- Uniform continuity is a global property, whereas continuity is a local property.
- On a compact domain, every continuous function is uniformly continuous (the Heine–Cantor theorem).
