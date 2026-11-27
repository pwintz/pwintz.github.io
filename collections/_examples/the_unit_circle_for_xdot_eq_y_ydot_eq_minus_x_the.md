---
title: 'The unit circle, for $\dot{x} = y$, $\dot{y} = -x$ (the harmonic oscillator)'
level: undergraduate
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.8, 1.8]
    y: [-1.8, 1.8]
    field: ["y", "-x"]
    shapes:
      - { circle: [0, 0, 1], color: 1 }
      - { trajectory: [0.5, 0], t: 6.28 }
      - { trajectory: [1.5, 0], t: 6.28 }
  caption: |-
    The vector field $(y, -x)$, with the unit circle (orange) and the trajectories from $(0.5, 0)$ and $(1.5, 0)$ (blue).
  alt: "Gray arrows circling the origin clockwise, with three concentric circular orbits; the middle one, of radius 1, in orange."
is: [
  periodic_orbit,
  omega_limit_set
]
is_not: [
  limit_cycle,
  attractive,
  attractor
]
why:
  periodic_orbit: >-
    The unit circle is a periodic orbit of the harmonic oscillator, because the solution $(\cos t, -\sin t)$ goes around the unit circle with period $2 \pi$.
  omega_limit_set: >-
    The unit circle is the ω-limit set of each of its own points, because the solutions on it go around it periodically.
  limit_cycle: >-
    The unit circle is not a limit cycle of the harmonic oscillator, because every nearby circle is also a periodic orbit, so it is not isolated.
  attractive: >-
    The unit circle is not attractive for the harmonic oscillator, because nearby solutions stay on their own circles and do not approach it.
  attractor: >-
    The unit circle is not an attractor for the harmonic oscillator, because nearby solutions do not approach it.
---
