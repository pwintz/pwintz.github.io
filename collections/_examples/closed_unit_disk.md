---
title: 'The closed unit disk $D = \setdef{(x, y) \suchthat x^2 + y^2 \leq 1}$'
level: high-school
is: [
  compact,
  closed_ball,
  connected,
  path_connected,
  simply_connected,
  convex_set
]
values:
  interior: '$\operatorname{int} D = \setdef{(x, y) \suchthat x^2 + y^2 < 1}$'
  boundary: '$\partial D = \setdef{(x, y) \suchthat x^2 + y^2 = 1}$'
  exterior: '$\operatorname{ext} D = \setdef{(x, y) \suchthat x^2 + y^2 > 1}$'
  area: '$\pi$'
  diameter: '$2$'
  cardinality: '$\mathfrak{c}$'
  lebesgue_measure: '$\pi$'
  hausdorff_dimension: '$2$'
why:
  convex_set: >-
    The closed unit disk is convex, because the segment between two points of the disk stays in the disk.
  boundary: >-
    The boundary of the closed unit disk $D$ is the unit circle.
  interior: >-
    The interior of the closed unit disk $D$ is the open disk.
  area: >-
    The area of the closed unit disk is $\pi r^2$ with $r = 1$.
  diameter: >-
    The diameter of the closed unit disk is $2$, the distance between two opposite points of its boundary.
  cardinality: >-
    The cardinality of the closed unit disk is $\mathfrak{c}$, the same as that of $\reals$.
  lebesgue_measure: >-
    The two-dimensional Lebesgue measure of the closed unit disk is its area, $\pi$.
  hausdorff_dimension: >-
    The Hausdorff dimension of the closed unit disk is $2$, as for every region of the plane with nonempty interior.
  simply_connected: >-
    The closed unit disk is simply connected because every loop in it can be shrunk to a point.
  path_connected: >-
    The closed unit disk is path-connected, and so connected, because the straight segment between two of its points stays in the disk.
  exterior: >-
    The boundary is the unit circle, which $D$ contains, and the exterior is everything outside the circle.
---
