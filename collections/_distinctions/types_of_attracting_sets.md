---
published: false
title: Types of attracting sets
kind: family
areas: [dynamics]
status: draft
summary: >
  An ω-limit set is where one particular solution ends up. An attractive set draws in all nearby solutions, and an attractor is a compact invariant set that does.
  A limit cycle is an isolated periodic orbit, which may attract or repel.
terms:
  - attractive
  - attractor
  - limit_cycle
  - omega_limit_set
examples:
  - example: the_origin_for_xdot_eq_minus_x
    why: >-
      It is the ω-limit set of every point.
  - example: the_limit_cycle_of_the_van_der_pol_oscillator
    why: >-
      Every solution except the equilibrium at the origin converges to it.
  - example: the_unit_circle_for_xdot_eq_y_ydot_eq_minus_x_the
    why: >-
      It is the ω-limit set of each of its own points. But every nearby circle is also a periodic orbit, so it is not isolated, and nearby solutions do not approach it.
  - example: the_circle_r_eq_1_for_rdot_eq_r_r_minus_1_dot
    why: >-
      It is an unstable limit cycle: solutions starting inside it spiral toward the origin, and solutions starting outside it go to infinity.
see_also:
  - types_of_attraction_regions
  - types_of_dynamic_stability
  - types_of_reoccurring
---
## Notes

- Definitions of "attractor" vary: some require stability, some require that the set contain no smaller attractor, and Milnor attractors only need to attract a set of initial states with positive measure.
- Strange attractors, such as the Lorenz attractor, are attractors with a fractal structure on which the dynamics are chaotic.
