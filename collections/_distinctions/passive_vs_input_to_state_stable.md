---
published: false
title: Passive vs. Input-to-State Stable
kind: siblings
areas: [control, dynamics]
summary: >
  [Passivity](/dictionary/definitions/passive) and [input-to-state stability](/dictionary/definitions/input-to-state-stable) both describe how a system with an input responds to that input.
  A passive system cannot return more [energy](/dictionary/definitions/energy) than it receives through its input and output.
  An input-to-state stable system has a state whose size is bounded by the size of the initial state and the size of the input.
  Neither property implies the other.
terms:
  - passive
  - input_to_state_stable
examples_note: >-
  In each row, is the system ___?
examples:
  - example: first_order_lag_xdot_eq_minus_x_plus_u_y_eq_x
  - example: integrator_xdot_eq_u_y_eq_x
  - example: xdot_eq_minus_x_plus_u_y_eq_minus_x
  - example: xdot_eq_x_plus_u_y_eq_x
see_also:
  - types_of_dynamic_passivity
  - types_of_input_output_stability
  - storage_function_vs_iss_lyapunov_function
---
## Notes

- Passivity is a property of the pair of input $u$ and output $y$, so changing the output can change whether a system is [passive](/dictionary/definitions/passive).
  Input-to-state stability is a property of the pair of input and state, so it does not depend on the output.
  For $\dot{x} = -x + u$, the output $y = x$ gives a passive system, but the output $y = -x$ does not.
- A passive system with a positive definite [storage function](/dictionary/definitions/storage-function) has a [stable](/dictionary/definitions/lyapunov-stable) origin when $u = 0$.
  An [input-to-state stable](/dictionary/definitions/input-to-state-stable) system has a [globally asymptotically stable](/dictionary/definitions/globally-asymptotically-stable) origin when $u = 0$.
  A [lossless](/dictionary/definitions/lossless) system, such as an integrator, is passive but not input-to-state stable.
- Passivity is preserved by parallel connections and by negative feedback connections.
  Input-to-state stability is preserved by cascade connections, and by feedback connections when the gains satisfy a small-gain condition.
