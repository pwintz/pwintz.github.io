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
      $r \mapsto r^2$ is of class $\mathcal{K}$ because it is continuous, increasing, and zero at $0$, and of class $\mathcal{K}_{\infty}$ because it is unbounded.
      It is positive definite, and it is not of class $\mathcal{L}$, because it does not decrease to $0$.
  - example: r_to_arctan_r_on_0_infinity
    why: >-
      $r \mapsto \arctan r$ is of class $\mathcal{K}$ because it is continuous, increasing, and zero at $0$, and it is positive definite.
      It is not of class $\mathcal{K}_{\infty}$, because it is bounded by $\pi / 2$.
  - example: s_to_e_minus_s
    why: >-
      $s \mapsto e^{-s}$ is of class $\mathcal{L}$ because it decreases to $0$.
      It is not of class $\mathcal{K}$, because $e^{0} = 1 \neq 0$.
  - example: r_s_to_r_e_minus_s
    why: >-
      $(r, s) \mapsto r e^{-s}$ is of class $\mathcal{KL}$ because it is of class $\mathcal{K}$ in $r$ and of class $\mathcal{L}$ in $s$.
      It is the standard bound for exponential stability.
  - example: square_on_reals
    why: >-
      $x \mapsto x^2$ on $\reals$ is positive definite because it is positive away from $0$ and zero at $0$.
      It is not of class $\mathcal{K}$, because it is not increasing on all of $\reals$.
  - example: x_1_x_2_to_x_1_squared_on_reals_squared
    why: >-
      $(x_1, x_2) \mapsto x_1^2$ is not positive definite, because it is zero on the whole $x_2$-axis.
      It is only positive semidefinite.
see_also:
  - types_of_dynamic_stability
---
