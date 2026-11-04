---
published: false
title: Lipschitz continuous vs. Hölder continuous
kind: hierarchy
areas: [analysis]
status: draft
summary: >
  A Lipschitz function changes at most proportionally to the change in input.
  A Hölder function with exponent $\alpha$ changes at most proportionally to the change in input raised to the power $\alpha$, which allows steeper behavior, as in $\sqrt{x}$ near $0$.
relation: Lipschitz continuous ⊂ Hölder continuous ⊂ uniformly continuous
terms:
  - uniformly_continuous
  - Lipschitz_continuous
  - Holder_continuous
examples:
  - example: x_to_x_on_minus_1_1
    why: >-
      $x \mapsto \lvert x \rvert$ is Lipschitz continuous with constant $1$, because $\lvert \lvert x \rvert - \lvert y \rvert \rvert \leq \lvert x - y \rvert$.
      So it is also Hölder continuous (with $\alpha = 1$) and uniformly continuous.
  - example: x_to_sqrt_x_on_0_1
    why: >-
      $x \mapsto \sqrt{x}$ is Hölder continuous with $\alpha = \frac{1}{2}$, since $\lvert \sqrt{x} - \sqrt{y} \rvert \leq \lvert x - y \rvert^{1/2}$, and so it is uniformly continuous.
      It is not Lipschitz continuous, because its slope is unbounded near $0$.
  - example: the_cantor_function_on_0_1
    why: >-
      The Cantor function is Hölder continuous with $\alpha = \log 2 / \log 3$, and so it is uniformly continuous.
      It is not Lipschitz continuous, because it rises by $2^{-n}$ over intervals of length $3^{-n}$, so its slopes are unbounded.
  - example: f_x_eq_1_ln_1_x_for_0_lt_x_leq_1_over_2_f_0_eq_0
    why: >-
      This $f$ is uniformly continuous because it is continuous on the compact interval $[0, \frac{1}{2}]$.
      It is not Hölder continuous for any $\alpha > 0$ (and so not Lipschitz continuous), because $f(x) / x^{\alpha} \to \infty$ as $x \to 0$.
see_also:
  - types_of_continuous
  - continuity_absolute_vs_Lipschitz
---
## Notes

- Hölder continuity does not fit into the chain on the [types of continuity](/distinctions/types-of-continuous) page: the Cantor function is Hölder continuous but not absolutely continuous, and $f(x) = 1 / \ln(1/x)$ (with $f(0) = 0$) is absolutely continuous on $[0, \frac{1}{2}]$ but not Hölder continuous.
