---
published: false
title: Types of limits of functions
kind: siblings
areas: [analysis]
status: draft
summary: >
  The limit of $f$ at $a$ describes $f(x)$ as $x$ approaches $a$ from both sides.
  The left and right limits look at only one side each.
  The limit exists exactly when both one-sided limits exist and are equal.
terms:
  - limit_of_function
  - left_limit
  - right_limit
examples:
  - example: sin_x_over_x
    why: >-
      $\frac{\sin x}{x}$ approaches $1$ from both sides of $0$, so the left limit, the right limit, and the limit are all $1$, even though $f(0)$ is undefined.
  - example: step_function
    why: >-
      The step function jumps at $0$, so its left limit is $0$ and its right limit is $1$.
      The one-sided limits differ, so the limit at $0$ does not exist.
  - example: one_over_x_at_0
    why: >-
      $\frac{1}{x}$ tends to $-\infty$ from the left of $0$ and to $\infty$ from the right, so neither one-sided limit exists as a real number.
      So the limit at $0$ does not exist.
  - example: removable_point_value
    why: >-
      $f(0) = 1$ is not the limit of $f$ at $0$, because the limit, $0$, depends only on the values of $f$ near $0$, not at $0$.
see_also:
  - types_of_limits
  - types_of_extreme_values
  - continuous_vs_uniform_continuous
---
## Notes

- One-sided limits are also used at the endpoints of an interval, where only one side is available.
  For $f(x) = \sqrt{x}$, only the right limit at $0$ makes sense.
- The [one-sided derivative](/definitions/one-sided-derivative) of $f$ at $a$ is the one-sided limit of its difference quotient.
