---
published: false
title: Controllable vs. reachable vs. stabilizable
kind: hierarchy
areas: [control]
status: draft
summary: >
  A controllable system can be steered from any state to the origin, and a reachable system can be steered from the origin to any state.
  A stabilizable system only needs feedback that makes it converge, so its uncontrollable parts must already be stable.
relation: >
  controllable ⊂ stabilizable, and for continuous-time linear systems, controllable = reachable.
terms:
  - controllable
  - reachable
  - stabilizable
examples:
  - example: xdot_eq_u
    why: >-
      Any state can be steered to any other, for example with a constant input.
  - example: dot_x_1_eq_x_2_dot_x_2_eq_u_double_integrator
    why: >-
      With $B = (0, 1)^{\top}$, the matrix $\begin{bmatrix} B & A B \end{bmatrix}$ has rank $2$.
  - example: dot_x_1_eq_minus_x_1_dot_x_2_eq_x_2_plus_u
    why: >-
      The input cannot affect $x_1$, but $x_1$ decays on its own, and $u = -2 x_2$ stabilizes $x_2$.
  - example: xdot_eq_x_plus_0_cdot_u
    why: >-
      The input has no effect, and the state grows.
  - example: x_k_plus_1_eq_0_cdot_x_k_plus_0_cdot_u_k
    why: >-
      Every state reaches $0$ after one step, so the system is controllable to the origin. But no nonzero state can ever be reached.
see_also:
  - observable_vs_detectable_vs_reconstructible
  - state_vs_output_feedback
  - types_of_dynamic_stability
---
## Notes

- The discrete-time example shows why "controllable" and "reachable" are different definitions. They agree for continuous-time linear systems, and for discrete-time linear systems with an invertible $A$.
- For nonlinear systems, controllability does not imply stabilizability by continuous feedback. The nonholonomic integrator is controllable, but Brockett's condition shows that no continuous static feedback stabilizes it.
