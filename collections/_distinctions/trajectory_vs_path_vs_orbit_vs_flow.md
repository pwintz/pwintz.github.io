---
published: false
title: Trajectory vs. path vs. orbit vs. flow
kind: family
areas: [dynamics, topology]
summary: >
  The motion of a point through a space can be described in several ways, which keep different amounts of information.
  A [trajectory](/dictionary/definitions/trajectory) is a function $x(t)$ of time that solves a dynamical system, so the trajectory says where the state is at each time.
  A [path](/dictionary/definitions/path) is a [continuous](/dictionary/definitions/continuous) function $\gamma(s)$ of a parameter $s \in [0, 1]$, which need not solve a dynamical system and need not move at a particular speed.
  An [orbit](/dictionary/definitions/orbit) is the set of states that a trajectory passes through, which forgets the times.
  A [flow](/dictionary/definitions/flow) is the function $\varphi(t, x_0)$ that gives the trajectories from all initial states $x_0$ at once.
terms:
  - trajectory
  - path
  - orbit
  - flow
examples:
  - example: the_harmonic_oscillator_starting_from_1_0
    why: >-
      For the harmonic oscillator from $(1, 0)$, the trajectory $(\cos t, -\sin t)$ goes around the unit circle forever, the path traces the circle once as $s$ goes from $0$ to $1$, the orbit is the circle itself as a set, and the flow gives the trajectories from every starting point, not only from $(1, 0)$.
  - example: exponential_decay_xdot_eq_minus_x_starting_from_1
  - example: the_straight_line_path_from_1_0_to_0_1_for_the_harmonic_oscillator
see_also:
  - types_of_ode_solutions
---
## Notes

- Usage varies: some authors use "[trajectory](/dictionary/definitions/trajectory)" or "path" for the set of states visited, which this page calls the [orbit](/dictionary/definitions/orbit), and physicists often call the orbit the "path" of a moving object.
- The word "orbit" comes from group theory, where the orbit of a point is the set of all points that the group moves the point to; the [flow](/dictionary/definitions/flow) is an action of the group of times $\reals$ on the states.
- Every trajectory restricted to a closed interval $[t_0, t_1]$ gives a path, $\gamma(s) = x(t_0 + s (t_1 - t_0))$, but most [paths](/dictionary/definitions/path) are not trajectories of a given system.
