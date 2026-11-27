---
title: '$\setdef{(x, y) \suchthat x^2 + y^2 < 1}$'
level: high-school
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.6, 1.6]
    y: [-1.6, 1.6]
    shapes:
      - { disk: [0, 0, 1], open: true }
  caption: |-
    The set $x^2 + y^2 < 1$ (shaded), without its boundary circle (dashed).
  alt: "A shaded disk of radius 1 around the origin, with a dashed boundary circle."
is: [
  ball,
  open_ball
]
is_not: [
  closed_ball,
  circle
]
why:
  open_ball: >-
    $\setdef{(x, y) \suchthat x^2 + y^2 < 1}$ is the open unit disk, an open ball (and so a ball) in $\reals^2$.
  closed_ball: >-
    $\setdef{(x, y) \suchthat x^2 + y^2 < 1}$ is not a closed ball, because it leaves out the circle $x^2 + y^2 = 1$.
  circle: >-
    $\setdef{(x, y) \suchthat x^2 + y^2 < 1}$ is not a circle, because it includes the inside.
---
