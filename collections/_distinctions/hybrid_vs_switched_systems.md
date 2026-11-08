---
published: false
title: Switched system vs. hybrid system vs. hybrid automaton
kind: family
areas: [dynamics, control]
summary: >
  Some dynamical systems combine [continuous](/definitions/continuous) change with discrete events, and they are modeled in several ways.
  A [hybrid system](/definitions/hybrid-system) has states that both flow and jump.
  A [switched system](/definitions/switched-system) is a special case whose continuous state never jumps; only the active mode changes.
  A [hybrid automaton](/definitions/hybrid-automaton) is a way of modeling a hybrid system as a graph of modes.
relation: switched systems ⊂ hybrid systems
terms:
  - switched_system
  - hybrid_system
  - hybrid_automaton
examples:
  - example: a_bouncing_ball
  - example: a_thermostat_that_switches_a_heater_on_and_off
  - example: xdot_eq_a_sigma_t_x_switching_arbitrarily_between
  - example: a_sampled_data_control_system
see_also:
  - complete_vs_maximal_solutions
  - types_of_ode_solutions
---
## Notes

- A [switched system](/definitions/switched-system) can be unstable even if every subsystem is [asymptotically stable](/definitions/asymptotically-stable), because of how the switches are timed.
  A common [Lyapunov function](/definitions/lyapunov-function) for all of the subsystems guarantees stability under arbitrary switching.
- The flow-set and jump-set formulation of Goebel, Sanfelice, and Teel and the [hybrid automaton](/definitions/hybrid-automaton) formulation describe the same class of systems.
  The former is convenient for Lyapunov analysis, and the latter for modeling and verification.
