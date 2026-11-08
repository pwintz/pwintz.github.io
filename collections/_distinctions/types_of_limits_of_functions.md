---
published: false
title: Types of limits of functions
kind: siblings
areas: [analysis]
summary: >
  The limit of a function at a point can be taken from both sides or from one side.
  The limit of $f$ at $a$ describes $f(x)$ as $x$ approaches $a$ from both sides.
  The left and [right limits](/definitions/right-limit) look at only one side each.
  The limit exists exactly when both one-sided limits exist and are equal.
terms:
  - limit_of_function
  - left_limit
  - right_limit
examples:
  - example: sin_x_over_x
  - example: step_function
    why: >-
      The one-sided limits differ, so the limit at $0$ does not exist.
  - example: one_over_x_at_0
  - example: removable_point_value
see_also:
  - types_of_limits
  - types_of_extreme_values
  - continuous_vs_uniform_continuous
---
## Notes

- One-sided limits are also used at the endpoints of an interval, where only one side is available.
  For $f(x) = \sqrt{x}$, only the [right limit](/definitions/right-limit) at $0$ makes sense.
- The [one-sided derivative](/definitions/one-sided-derivative) of $f$ at $a$ is the one-sided limit of its difference quotient.
