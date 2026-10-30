---
published: false
title: Types of comparison functions
kind: family
areas: [dynamics, control]
status: draft
summary: >
  Comparison functions are scalar functions with simple monotonicity properties, used to state stability bounds without specific formulas.
  Class-$\mathcal{K}$ functions start at zero and increase, class-$\mathcal{L}$ functions decrease to zero, and class-$\mathcal{KL}$ functions combine both.
relation: class-$$\mathcal{K}_\infty$$ ⊂ class-$\mathcal{K}$, and every class-$\mathcal{K}$ function is positive definite on its domain.
terms:
  - positive_definite_function
  - class_K
  - class_K_infinity
  - class_L
  - class_KL
examples:
  - example: r_to_r_squared_on_0_infinity
    why: >-
      Increasing and unbounded.
  - example: r_to_arctan_r_on_0_infinity
    why: >-
      It is bounded by $\pi / 2$.
  - example: s_to_e_minus_s
    why: >-
      Decreasing to $0$, but $e^{0} = 1 \neq 0$.
  - example: r_s_to_r_e_minus_s
    why: >-
      The standard bound for exponential stability.
  - example: square_on_reals
    why: >-
      Positive away from $0$, but not increasing on all of $\reals$.
  - example: x_1_x_2_to_x_1_squared_on_reals_squared
    why: >-
      It is positive semidefinite, since it is zero on the whole $x_2$-axis.
see_also:
  - types_of_dynamic_stability
---
