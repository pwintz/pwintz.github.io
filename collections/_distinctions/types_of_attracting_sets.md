---
published: false
title: Types of attracting sets
kind: family
areas: [dynamics]
status: draft
summary: >
  In a dynamical system, several kinds of sets describe where solutions end up.
  An ω-limit set is where one particular solution ends up.
  An attractive set draws in all nearby solutions, and an attractor is a compact invariant set that does.
  A limit cycle is an isolated periodic orbit, which may attract or repel.
terms:
  - attractive
  - attractor
  - limit_cycle
  - omega_limit_set
examples:
  - example: the_origin_for_xdot_eq_minus_x
    why: >-
      The origin is attractive and an attractor because every solution of $\dot{x} = -x$ converges to it.
      It is the ω-limit set of every point, and it is not a limit cycle, because it is a single point, not a periodic orbit.
  - example: the_limit_cycle_of_the_van_der_pol_oscillator
    why: >-
      The Van der Pol limit cycle is an isolated periodic orbit, so it is a limit cycle.
      It is attractive, an attractor, and the ω-limit set of every point except the origin, because every solution except the equilibrium at the origin converges to it.
  - example: the_unit_circle_for_xdot_eq_y_ydot_eq_minus_x_the
    why: >-
      The unit circle is the ω-limit set of each of its own points, because the solutions on it go around it periodically.
      It is not a limit cycle, because every nearby circle is also a periodic orbit, so it is not isolated, and it is not attractive or an attractor, because nearby solutions do not approach it.
  - example: the_circle_r_eq_1_for_rdot_eq_r_r_minus_1_dot
    why: >-
      The circle $r = 1$ is an isolated periodic orbit, so it is a limit cycle, and it is the ω-limit set of each of its points.
      It is not attractive or an attractor, because solutions starting inside it spiral toward the origin, and solutions starting outside it go to infinity.
see_also:
  - types_of_attraction_regions
  - types_of_dynamic_stability
  - types_of_reoccurring
---
## Notes

- Definitions of "attractor" vary: some require stability, some require that the set contain no smaller attractor, and Milnor attractors only need to attract a set of initial states with positive measure.
- Strange attractors, such as the Lorenz attractor, are attractors with a fractal structure on which the dynamics are chaotic.
