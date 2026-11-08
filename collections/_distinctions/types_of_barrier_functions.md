---
published: false
title: Types of barrier functions
kind: siblings
areas: [control, dynamics]
summary: >
  Barrier certificates, barrier functions, and control barrier functions all certify safety by keeping solutions in a set, but with different conventions: a [barrier certificate](/definitions/barrier-certificate) is nonpositive on the initial set, while a barrier function is nonnegative on the safe set.
  A [control barrier function](/definitions/control-barrier-function) can be kept valid by choosing the input.
terms:
  - barrier_certificate
  - barrier_function
  - control_barrier_function
examples_note: >-
  In the first two rows, the initial set is $X_0 = [-1, 1]$ and the unsafe set is $X_u = \setdef{x \suchthat \abs{x} \geq 2}$.
examples:
  - example: b_x_eq_x_squared_minus_2_for_xdot_eq_minus_x
  - example: h_x_eq_2_minus_x_squared_for_xdot_eq_minus_x
  - example: h_x_eq_1_minus_x_squared_for_xdot_eq_u
see_also:
  - meanings_of_barrier_function
  - lyapunov_vs_barrier_functions
  - types_of_dynamic_set_invariance
  - types_of_lyapunov_functions
---
## Sign conventions

| Concept | Safe or initial region | Unsafe region | Derivative condition |
| --- | --- | --- | --- |
| [Barrier certificate](/definitions/barrier-certificate) $B$ | $B \leq 0$ on $X_0$ | $B > 0$ on $X_u$ | $\dot{B} \leq 0$ |
| Barrier function $h$ | $h \geq 0$ on $C$ | outside $C$ | $\dot{h} \geq -\alpha(h)$ |

Negating a barrier certificate need not give a barrier function, because the derivative conditions differ.

## Notes

- Older _reciprocal_ barrier functions tend to infinity at the boundary of the safe set, like barrier functions in optimization.
  The _zeroing_ barrier functions on this page are finite and equal zero on the boundary.
- "Safe set" in the [control barrier function](/definitions/control-barrier-function) literature means the set $C$ that is rendered [forward invariant](/definitions/forward-invariant).
  In the barrier certificate literature, safety is a property of the system with respect to $X_0$ and $X_u$.
- In optimization, "barrier function" means something else.
  See [the meanings of "barrier function"](/distinctions/meanings-of-barrier-function).
