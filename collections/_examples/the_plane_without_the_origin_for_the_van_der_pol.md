---
title: 'The plane without the origin, for the Van der Pol oscillator'
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
      - { point: [0, 0], open: true, color: 1 }
  caption: |-
    The Van der Pol vector field, with the trajectories from $(0.1, 0)$ (blue) and $(-3, 3)$ (green), and the origin (hollow dot).
  alt: "Gray arrows and two trajectories that approach the same closed loop around the origin, one from inside and one from outside; the origin is a hollow dot."
is: [
  basin_of_attraction,
  forward_invariant
]
is_not: [region_of_attraction]
why:
  region_of_attraction: >-
    The plane without the origin is not called a region of attraction, because that term usually refers to an equilibrium.
  basin_of_attraction: >-
    The plane without the origin is the basin of attraction of the Van der Pol limit cycle, because every solution except the equilibrium at the origin converges to it.
  forward_invariant: >-
    The plane without the origin is forward invariant for the Van der Pol oscillator, because a solution that starts away from the origin never reaches it.
---
