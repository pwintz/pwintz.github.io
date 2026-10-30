---
published: false
title: Constant vs. fixed point vs. invariant vs. idempotent vs. uniform
kind: family
areas: [language]
status: draft
summary: >
  A constant function has one value everywhere. An invariant quantity is unchanged by a particular transformation, but may differ from place to place.
  "Uniform" means the same bounds work everywhere. Idempotent functions do nothing more the second time, and a fixed point is a single input that a function leaves alone.
terms:
  - constant_function
  - fixed_point
  - invariant
  - identity_element
  - idempotent
  - uniform
examples:
  - example: constant_function_5
    why: >-
      Applying it twice still gives $5$. Its only fixed point is $5$.
  - example: identity_function
    why: >-
      The identity function is the identity element for composition, and every point is a fixed point.
  - example: abs_x
    why: >-
      $\lvert \lvert x \rvert \rvert = \lvert x \rvert$.
  - example: energy_h_eq_1_over_2_p_squared_plus_q_squared_for
    why: >-
      It is constant along each solution, but different solutions have different energies.
  - example: x_n_to_0_on_0_1_over_2
    why: >-
      $x^n \leq 2^{-n}$ for every $x$ in the interval.
  - example: x_n_to_0_on_0_1
    why: >-
      For each $n$, there are points near $1$ where $x^n$ is close to $1$.
  - example: 0_for_x_to_x_squared
    why: >-
      $0^2 = 0$.
see_also:
  - types_of_symmetry
  - types_of_dynamic_set_invariance
---
