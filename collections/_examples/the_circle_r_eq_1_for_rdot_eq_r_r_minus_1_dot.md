---
published: false
title: 'The circle $r = 1$, for $\dot{r} = r (r - 1)$, $\dot{\theta} = 1$ in polar coordinates'
level: undergraduate
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.8, 1.8]
    y: [-1.8, 1.8]
    field: ["x (sqrt(x^2 + y^2) - 1) - y", "y (sqrt(x^2 + y^2) - 1) + x"]
    shapes:
      - { circle: [0, 0, 1], color: 1 }
      - { trajectory: [0.95, 0], t: 12 }
      - { trajectory: [1.05, 0], t: 2.6, color: 2 }
  caption: |-
    The vector field of $\dot{r} = r (r - 1)$, $\dot{\theta} = 1$, with the circle $r = 1$ (orange) and the trajectories from $r = 0.95$ (blue) and $r = 1.05$ (green).
  alt: "Gray arrows, an orange unit circle, a trajectory spiraling inward from just inside the circle, and one spiraling outward from just outside."
is: [
  periodic_orbit,
  limit_cycle,
  omega_limit_set
]
is_not: [
  attractive,
  attractor
]
why:
  periodic_orbit: >-
    The circle $r = 1$, for $\dot{r} = r (r - 1)$, $\dot{\theta} = 1$, is a periodic orbit, because on the circle $\dot{r} = 0$ and $\dot{\theta} = 1$, so the solutions go around the circle with period $2 \pi$.
  limit_cycle: >-
    The circle $r = 1$ is a limit cycle, because it is an isolated periodic orbit.
  attractive: >-
    The circle $r = 1$, for $\dot{r} = r (r - 1)$, $\dot{\theta} = 1$ in polar coordinates, is not attractive, because solutions starting inside it spiral toward the origin, and solutions starting outside it go to infinity.
  attractor: >-
    The circle $r = 1$, for $\dot{r} = r (r - 1)$, $\dot{\theta} = 1$ in polar coordinates, is not an attractor, because solutions starting inside it spiral toward the origin, and solutions starting outside it go to infinity.
  omega_limit_set: >-
    The circle $r = 1$ is the ω-limit set of each of its points, because solutions on it go around it periodically.
---
