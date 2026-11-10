---
title: Periodic orbit vs. limit cycle
kind: hierarchy
areas: [dynamics]
summary: >
  In a dynamical system, a solution can return to its starting state and go around the same loop again and again.
  A [periodic orbit](/definitions/periodic-orbit) is such a loop.
  A [limit cycle](/definitions/limit-cycle) is a periodic orbit that is isolated, with no other periodic orbits nearby, so that nearby solutions spiral toward the limit cycle or away from it.
relation: limit cycle ⊂ periodic orbit
terms:
  - periodic_orbit
  - limit_cycle
examples:
  - example: the_unit_circle_for_xdot_eq_y_ydot_eq_minus_x_the
    why: >-
      The unit circle is a periodic orbit of the harmonic oscillator but not a limit cycle, because every circle around the origin is also a periodic orbit, so the unit circle is surrounded by other periodic orbits.
  - example: the_limit_cycle_of_the_van_der_pol_oscillator
  - example: the_circle_r_eq_1_for_rdot_eq_r_r_minus_1_dot
see_also:
  - types_of_attracting_sets
---
## Notes

- A limit cycle can be stable, unstable, or semistable (attracting from one side and repelling from the other).
- Linear systems have no [limit cycles](/definitions/limit-cycle), because a multiple of a [periodic](/definitions/periodic) solution of a linear system is another periodic solution, so [periodic orbits](/definitions/periodic-orbit) of linear systems are never isolated.
- [Conservative systems](/definitions/conservative-system), such as the frictionless pendulum, have families of periodic orbits, and limit cycles arise in systems that gain and lose energy, such as the Van der Pol oscillator.
