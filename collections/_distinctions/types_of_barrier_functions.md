---
published: false
title: Types of barrier functions
kind: siblings
areas: [control, dynamics]
status: draft
summary: >
  All three certify safety by keeping solutions in a set, but with different conventions: a barrier certificate is nonpositive on the initial set,
  while a barrier function is nonnegative on the safe set. A control barrier function can be kept valid by choosing the input.
terms:
  - barrier_certificate
  - barrier_function
  - control_barrier_function
examples_note: >-
  In the first two rows, the initial set is $X_0 = [-1, 1]$ and the unsafe set is $X_u = \lbrace x : \lvert x \rvert \geq 2 \rbrace$.
examples:
  - example: b_x_eq_x_squared_minus_2_for_xdot_eq_minus_x
    why: >-
      $B \leq -1$ on $X_0$, $B \geq 2$ on $X_u$, and $\nabla B(x) \cdot f(x) = -2 x^2 \leq 0$. As a barrier function, it has the wrong sign.
  - example: h_x_eq_2_minus_x_squared_for_xdot_eq_minus_x
    why: >-
      $\nabla h(x) \cdot f(x) = 2 x^2 \geq x^2 - 2 = -h(x)$, so it is a barrier function with $\alpha(r) = r$. It certifies that $[-\sqrt{2}, \sqrt{2}]$, which contains $X_0$ and misses $X_u$, is forward invariant. As a barrier certificate, it has the wrong sign.
  - example: h_x_eq_1_minus_x_squared_for_xdot_eq_u
    why: >-
      The input $u = -x$ gives $\nabla h(x) \cdot u = 2 x^2 \geq x^2 - 1 = -h(x)$.
see_also:
  - meanings_of_barrier_function
  - lyapunov_vs_barrier_functions
  - types_of_dynamic_set_invariance
  - types_of_lyapunov_functions
---
## Sign conventions

| Concept | Safe or initial region | Unsafe region | Derivative condition |
| --- | --- | --- | --- |
| Barrier certificate $B$ | $B \leq 0$ on $X_0$ | $B > 0$ on $X_u$ | $\dot{B} \leq 0$ |
| Barrier function $h$ | $h \geq 0$ on $C$ | outside $C$ | $\dot{h} \geq -\alpha(h)$ |

Negating a barrier certificate does not always give a barrier function, because the derivative conditions differ.

## Notes

- Older _reciprocal_ barrier functions tend to infinity at the boundary of the safe set, like barrier functions in optimization. The _zeroing_ barrier functions on this page are finite and equal zero on the boundary.
- "Safe set" in the control barrier function literature means the set $C$ that is rendered forward invariant. In the barrier certificate literature, safety is a property of the system with respect to $X_0$ and $X_u$.
- In optimization, "barrier function" means something else. See [the meanings of "barrier function"](/distinctions/meanings-of-barrier-function).
