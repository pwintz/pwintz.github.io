---
published: false
title: Lipschitz continuous vs. Hölder continuous
kind: hierarchy
areas: [analysis]
summary: >
  Lipschitz and Hölder continuity both bound how much a function's output can change in terms of how much its input changes.
  A Lipschitz function changes at most proportionally to the change in input.
  A Hölder function with exponent $\alpha$ changes at most proportionally to the change in input raised to the power $\alpha$, which allows steeper behavior, as in $\sqrt{x}$ near $0$.
relation: Lipschitz continuous ⊂ Hölder continuous ⊂ uniformly continuous
terms:
  - uniformly_continuous
  - Lipschitz_continuous
  - Holder_continuous
examples:
  - example: x_to_x_on_minus_1_1
  - example: x_to_sqrt_x_on_0_1
  - example: the_cantor_function_on_0_1
  - example: f_x_eq_1_ln_1_x_for_0_lt_x_leq_1_over_2_f_0_eq_0
see_also:
  - types_of_continuous
  - continuity_absolute_vs_Lipschitz
---
## Notes

- Hölder continuity does not fit into the chain on the [types of continuity](/distinctions/types-of-continuous) page: the Cantor function is [Hölder continuous](/definitions/holder-continuous) but not [absolutely continuous](/definitions/absolutely-continuous), and $f(x) = 1 / \ln(1/x)$ (with $f(0) = 0$) is absolutely continuous on $[0, \frac{1}{2}]$ but not Hölder continuous.
