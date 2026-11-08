---
published: false
title: Types of integrals
kind: family
areas: [analysis]
summary: >
  An integral adds up the values of a function, weighted by small pieces of something, and different integrals differ in how the pieces are cut and weighted.
  The [Riemann integral](/definitions/riemann-integral) cuts the domain into small intervals, and an [improper integral](/definitions/improper-integral) extends it by a limit to unbounded intervals or functions.
  The [Riemann–Stieltjes integral](/definitions/riemann-stieltjes-integral) weights the pieces by the change in another function, and the [Lebesgue integral](/definitions/lebesgue-integral) cuts the range instead of the domain, which handles more functions and limits.
  The Itô and [Stratonovich integrals](/definitions/stratonovich-integral) integrate with respect to [Brownian motion](/definitions/brownian-motion), where the point at which the integrand is evaluated changes the answer.
terms:
  - riemann_integral
  - improper_integral
  - riemann_stieltjes_integral
  - lebesgue_integral
  - ito_integral
  - stratonovich_integral
examples_note: >-
  Each cell is the integral of the function in that row, in the sense of that column, or "None" if that integral does not exist.
examples:
  - example: x_to_x_squared_on_0_1
  - example: one_over_sqrt_x_on_0_1
    why: >-
      The function $1 / \sqrt{x}$ is unbounded, so it has no Riemann integral, but its improper and Lebesgue integrals agree.
  - example: dirichlet_function_on_0_1
    why: >-
      The indicator function of $\mathbb{Q}$ is the standard example of a function with a Lebesgue integral but no Riemann integral.
  - example: sin_x_over_x_on_0_infinity
    why: >-
      The function $\frac{\sin x}{x}$ is the standard example of the reverse: it has an improper integral but no Lebesgue integral, because the improper integral relies on cancellation.
  - example: x_d_x_squared_on_0_1
  - example: x_d_step_at_one_half
    why: >-
      Integrating with respect to a step function picks out a single value, which a Riemann integral cannot do.
  - example: integral_of_w_dw
    why: >-
      Integrating Brownian motion with respect to itself gives different answers for the Itô and Stratonovich integrals, which differ by $\frac{1}{2} T$, because the two integrals evaluate $W$ at different points of each subinterval.
see_also:
  - types_of_size
  - types_of_derivatives
---
