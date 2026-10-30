---
published: false
title: Types of nonsmooth derivatives
kind: family
areas: [analysis, set-valued-analysis]
status: draft
summary: >
  These generalize the derivative to functions with corners or jumps. One-sided and Dini derivatives are limits from one side; Dini derivatives always exist.
  The Clarke generalized gradient and the subdifferential are sets of possible slopes, and a weak derivative is defined by integration by parts.
terms:
  - one_sided_derivative
  - subdifferential
  - dini_derivative
  - clarke_generalized_gradient
  - weak_derivative
examples_note: >-
  Each cell is the ___ of the function in that row.
examples:
  - example: abs_x
    why: >-
      When a one-sided derivative exists, the corresponding Dini derivatives equal it. Since $\lvert x \rvert$ is convex, its subdifferential equals its Clarke generalized gradient, the convex hull of the nearby derivatives $\pm 1$.
  - example: negative_abs_x
    why: >-
      The function is concave, so no line through $(0, 0)$ lies below its graph, and it has no subgradients at $0$.
  - example: x_sin_inverse_x
    why: >-
      The difference quotient $\frac{f(h) - f(0)}{h} = \sin(1/h)$ oscillates, so the one-sided derivatives do not exist, but its limit superior and limit inferior do.
see_also:
  - types_of_derivatives
  - types_of_differentiability
  - types_of_ode_solutions
---
## Notes

- In Lyapunov theory, a continuous but nonsmooth function $V$, such as a maximum of several functions, can still prove stability: one checks the Dini derivative $D^{+} V(x(t))$ along solutions, or a condition on the Clarke generalized gradient.
- For convex functions, the Clarke generalized gradient equals the subdifferential. For continuously differentiable functions, both reduce to $\lbrace \nabla f(x) \rbrace$.
- Weak derivatives are the basis of Sobolev spaces, which are used to study partial differential equations whose solutions are not smooth.
