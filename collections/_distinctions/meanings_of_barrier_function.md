---
published: false
title: "Barrier function: optimization vs. control theory"
kind: conflicting
areas: [control, analysis]
status: draft
summary: >
  In control theory, a (zeroing) barrier function is finite, equals zero on the boundary of a safe set, and certifies that the set is forward invariant.
  In optimization, a barrier function tends to infinity at the boundary of the feasible set, which keeps an interior-point method inside it.
terms:
  - barrier_function_optimization
  - barrier_function
examples_note: >-
  Is the function shown a barrier function in the ___ sense?
examples:
  - example: h_x_eq_2_minus_x_squared_for_xdot_eq_minus_x
    why: >-
      It is zero on the boundary of $[-\sqrt{2}, \sqrt{2}]$, and $\nabla h(x) \cdot f(x) = 2 x^2 \geq -h(x)$, so this set is forward invariant.
  - example: minus_log_2_minus_x_squared_on_minus_sqrt_2_sqrt_2
    why: >-
      It tends to infinity at the boundary of the feasible set $\lbrace x : x^2 - 2 < 0 \rbrace$.
see_also:
  - types_of_barrier_functions
---
## Notes

- Older _reciprocal_ barrier functions in control theory, such as $1 / h(x)$, tend to infinity at the boundary of the safe set. They resemble barrier functions in optimization, and they have largely been replaced by the zeroing barrier functions above.
