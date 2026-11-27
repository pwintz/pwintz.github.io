---
published: false
title: 'The limit cycle of the Van der Pol oscillator'
level: undergraduate
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-3.2, 3.2]
    y: [-3.2, 3.2]
    field: ["y", "(1 - x^2) y - x"]
    shapes:
      - { trajectory: [0.1, 0], t: 25 }
      - { trajectory: [-3, 3], t: 25, color: 2 }
      - { trajectory: [2.0086, 0], t: 6.7, color: 1 }
  caption: |-
    The Van der Pol vector field $(y, (1 - x^2) y - x)$, with the limit cycle (orange) and trajectories from $(0.1, 0)$ (blue) and $(-3, 3)$ (green).
  alt: "Gray arrows, a closed loop around the origin in orange, and two trajectories, one spiraling out from near the origin and one spiraling in from outside, both approaching the loop."
is: [
  periodic_orbit,
  limit_cycle,
  attractor,
  attractive,
  omega_limit_set
]
why:
  periodic_orbit: >-
    The limit cycle of the Van der Pol oscillator is a periodic orbit, because the solutions on it repeat with a fixed period.
  limit_cycle: >-
    The Van der Pol limit cycle is an isolated periodic orbit, so it is a limit cycle.
  omega_limit_set: >-
    The limit cycle of the Van der Pol oscillator is the ω-limit set of every point except the origin, because every solution except the equilibrium at the origin converges to it.
  attractive: >-
    The limit cycle of the Van der Pol oscillator is attractive, because every solution that starts near it converges to it.
  attractor: >-
    The limit cycle of the Van der Pol oscillator is an attractor, because it is attractive and invariant: solutions that start on it stay on it.
---
