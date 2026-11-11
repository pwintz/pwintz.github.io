---
title: Calculus of variations vs. optimal control
kind: hierarchy
areas: [control, analysis]
summary: >
  The calculus of variations and optimal control seek a function of time that minimizes a cost given by an integral.
  In the [calculus of variations](/dictionary/definitions/calculus-of-variations), the unknown is a curve $y(t)$, and the cost depends on $y$ and its derivative $y^{\prime}$, which can be chosen freely.
  In [optimal control](/dictionary/definitions/optimal-control), the unknown is an input $u(t)$, which may be constrained to a set $U$, and the state $x(t)$ is determined by the input through the dynamics $\dot{x} = f(x, u)$.
relation: calculus of variations ⊂ optimal control
terms:
  - calculus_of_variations
  - optimal_control
examples:
  - example: finding_the_shortest_curve_from_0_0_to_1_1
  - example: moving_a_cart_from_rest_to_rest_in_minimum_time_with_bounded_acceleration
    why: >-
      Moving a cart in minimum time is an optimal control problem but not a problem in the calculus of variations, because the input is bounded, and the optimal input jumps between its bounds.
  - example: minimizing_integral_of_x_sq_plus_u_sq_for_xdot_eq_x_plus_u
    why: >-
      Minimizing $\int_0^\infty (x^2 + u^2) \, \mathrm{d}t$ for $\dot{x} = x + u$ is posed as an optimal control problem, but the input is unconstrained and can be solved for from the dynamics, so the problem is also a problem in the calculus of variations.
---
## Notes

- A problem in the [calculus of variations](/dictionary/definitions/calculus-of-variations) is the [optimal control](/dictionary/definitions/optimal-control) problem with the dynamics $\dot{x} = u$ and no constraints on $u$.
- Pontryagin's maximum principle in optimal control generalizes the Euler–Lagrange equation of the calculus of variations to constrained inputs, where the optimal input can jump ("bang-bang" control).
- The Hamiltonian of Pontryagin's maximum principle is named after the [Hamiltonian](/dictionary/definitions/hamiltonian) of mechanics, which comes from the calculus of variations through Hamilton's principle.
