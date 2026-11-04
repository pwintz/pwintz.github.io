---
published: false
title: Types of nonsmooth derivatives
kind: family
areas: [analysis, set-valued-analysis]
status: draft
summary: >
  These generalize the derivative to functions with corners or jumps.
  One-sided and Dini derivatives are limits from one side; every real-valued function has Dini derivatives, possibly infinite.
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
      At $0$, the one-sided derivatives of $\lvert x \rvert$ are $1$ and $-1$, and the corresponding Dini derivatives equal them.
      $\lvert x \rvert$ is convex, so its subdifferential at $0$ equals its Clarke generalized gradient, $[-1, 1]$, the convex hull of the nearby derivatives $\pm 1$.
      Its weak derivative is $\operatorname{sign}(x)$, whose value at the single point $0$ does not matter.
  - example: negative_abs_x
    why: >-
      At $0$, the one-sided derivatives of $-\lvert x \rvert$ are $-1$ and $1$, and its Clarke generalized gradient is $[-1, 1]$.
      Its subdifferential at $0$ is empty, because $-\lvert x \rvert$ is concave, so no line through $(0, 0)$ lies below its graph.
  - example: x_sin_inverse_x
    why: >-
      The difference quotient $\frac{f(h) - f(0)}{h} = \sin(1/h)$ oscillates between $-1$ and $1$, so the one-sided derivatives at $0$ do not exist.
      The Dini derivatives exist, because they are the limit superior and limit inferior of that quotient, $1$ and $-1$.
see_also:
  - types_of_derivatives
  - types_of_differentiability
  - types_of_ode_solutions
---
## Notes

- In Lyapunov theory, a continuous but nonsmooth function $V$, such as a maximum of several functions, can still prove stability: one checks the Dini derivative $D^{+} V(x(t))$ along solutions, or a condition on the Clarke generalized gradient.
- For convex functions, the Clarke generalized gradient equals the subdifferential.
  For continuously differentiable functions, both reduce to $\lbrace \nabla f(x) \rbrace$.
- Weak derivatives are the basis of Sobolev spaces, which are used to study partial differential equations whose solutions are not smooth.
