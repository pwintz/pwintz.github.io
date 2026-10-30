---
published: false
title: Types of ODE solutions
kind: family
areas: [differential-equations, dynamics]
status: draft
summary: >
  A classical solution satisfies the differential equation at every time, and a Carathéodory solution at almost every time.
  Filippov and Krasovskii solutions replace a discontinuous right-hand side by a set of nearby values, so that solutions exist even where the right-hand side jumps.
  Hermes solutions are limits of solutions with vanishing measurement errors, and they turn out to be the Krasovskii solutions.
relation: >
  classical ⊂ Carathéodory, and Filippov ⊂ Krasovskii = Hermes (for locally bounded $f$). When $f$ is continuous, all of these notions agree.
terms:
  - classical_solution
  - caratheodory_solution
  - filippov_solution
  - krasovskii_solution
  - hermes_solution
examples:
  - example: x_t_eq_0_for_xdot_eq_minus_sign_x_with_sign_0_eq_0
    why: >-
      $\dot{x} = 0 = f(0)$, and $0 \in [-1, 1] = F(0)$.
  - example: x_t_eq_max_1_minus_t_0_for_xdot_eq_minus_sign_x
    why: >-
      It is not differentiable at $t = 1$, but the equation holds for almost every $t$.
  - example: x_t_eq_max_1_minus_t_0_for_xdot_eq_minus_sign_x_2
    why: >-
      For $t > 1$, $\dot{x} = 0 \neq f(0) = -1$. No Carathéodory solution continues past $t = 1$: from $0$, the vector field points into $x < 0$, where it points back. Filippov and Krasovskii solutions slide along $x = 0$.
  - example: x_t_eq_0_for_xdot_eq_f_x_with_f_x_eq_1_for_x_neq
    why: >-
      Filippov ignores the single point $x = 0$, so $F(0) = \lbrace 1 \rbrace$, which excludes $\dot{x} = 0$. Krasovskii does not ignore it, so $K(0) = [0, 1]$. It is also a Hermes solution, with no perturbation needed.
see_also:
  - complete_vs_maximal_solutions
  - types_of_nonsmooth_derivatives
---
## Notes

- Filippov solutions are the standard solution concept for sliding mode control and other discontinuous feedback. Krasovskii solutions appear in the theory of hybrid systems, where they make stability robust to small measurement errors.
- Hermes solutions explain why: a discontinuous feedback law evaluated at slightly wrong measurements can produce any Krasovskii solution, including ones that Filippov solutions rule out. So a property that holds for all Filippov solutions may fail in practice, while a property that holds for all Krasovskii solutions is robust to small measurement errors.
- Carathéodory solutions are needed for systems driven by inputs $u(t)$ that are merely measurable, such as bang-bang inputs, even when the dependence on $x$ is smooth.
