---
published: false
title: Types of nonsmooth derivatives
kind: family
areas: [analysis, set-valued-analysis]
summary: >
  [One-sided derivatives](/definitions/one-sided-derivative), Dini derivatives, subdifferentials, Clarke generalized gradients, and weak derivatives generalize the derivative to functions with corners or jumps.
  One-sided and [Dini derivatives](/definitions/dini-derivative) are limits from one side; every real-valued function has Dini derivatives, possibly infinite.
  The [Clarke generalized gradient](/definitions/clarke-generalized-gradient) and the [subdifferential](/definitions/subdifferential) are sets of possible slopes, and a [weak derivative](/definitions/weak-derivative) is defined by integration by parts.
terms:
  - one_sided_derivative
  - dini_derivative
  - clarke_generalized_gradient
  - subdifferential
  - weak_derivative
examples_note: >-
  Each cell is the ___ of the function in that row.
examples:
  - example: abs_x
  - example: negative_abs_x
  - example: x_sin_inverse_x
see_also:
  - types_of_derivatives
  - types_of_differentiability
  - types_of_ode_solutions
---
## Notes

- In Lyapunov theory, a [continuous](/definitions/continuous) but nonsmooth function $V$, such as a maximum of several functions, can still prove stability: one checks the [Dini derivative](/definitions/dini-derivative) $D^{+} V(x(t))$ along solutions, or a condition on the [Clarke generalized gradient](/definitions/clarke-generalized-gradient).
- For [convex functions](/definitions/convex-function), the Clarke generalized gradient equals the [subdifferential](/definitions/subdifferential).
  For [continuously differentiable](/definitions/continuously-differentiable) functions, both reduce to $\setdef{\nabla f(x)}$.
- [Weak derivatives](/definitions/weak-derivative) are the [basis](/definitions/vector-basis) of Sobolev spaces, which are used to study partial differential equations whose solutions are not smooth.
