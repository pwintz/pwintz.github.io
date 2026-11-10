---
published: false
title: '$\setdef{(x, y) \suchthat x^2 + y^2 = 1}$'
level: high-school
values:
  arc_length: '$2 \pi$'
  area: '$0$'
  diameter: '$2$'
  cardinality: '$\mathfrak{c}$'
  lebesgue_measure: '$0$'
  hausdorff_dimension: '$1$'
is: [
  circle,
  sphere,
  sphere_topological,
  circle_topological
]
is_not: [ball]
why:
  arc_length: >-
    The arc length of the unit circle is its circumference, $2 \pi r$ with $r = 1$.
  area: >-
    The area of the unit circle, as a set of points in the plane, is $0$, because a curve has no thickness. (The area of the disk inside it is $\pi$.)
  diameter: >-
    The diameter of the unit circle is $2$, the distance between two opposite points.
  cardinality: >-
    The cardinality of the unit circle is $\mathfrak{c}$, because its points correspond to the angles in $[0, 2\pi)$.
  lebesgue_measure: >-
    The two-dimensional Lebesgue measure of the unit circle is $0$, the same as its area.
  hausdorff_dimension: >-
    The Hausdorff dimension of the unit circle is $1$, as for every smooth curve.
  ball: >-
    $\setdef{(x, y) \suchthat x^2 + y^2 = 1}$ is not a ball, because it does not include the inside.
  circle_topological: >-
    $\setdef{(x, y) \suchthat x^2 + y^2 = 1}$ is the unit circle, which is also the unit sphere in $\reals^2$, and so a topological circle and sphere.
---
