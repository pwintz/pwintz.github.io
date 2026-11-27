---
published: false
title: 'The Sierpinski triangle'
level: undergraduate
description: >-
  Start with a solid equilateral triangle with side $1$, and remove the open triangle whose corners are the midpoints of its sides.
  Repeating this for each remaining triangle, forever, leaves the Sierpinski triangle.
figure:
  widget: self-similar
  params: { shape: sierpinski }
  caption: |-
    The first steps of the construction of the Sierpinski triangle, with its three copies in colors.
    Choose "A cover by small balls" to cover the set with balls of diameter $\delta$, and set the exponent $s$.
  alt: An equilateral triangle with smaller and smaller triangles removed, its bottom-left, bottom-right, and top thirds in three colors. A slider sets the number of steps.
values:
  diameter: '$1$'
  cardinality: '$\mathfrak{c}$'
  lebesgue_measure: '$0$'
  hausdorff_dimension: '$\log 3 / \log 2 \approx 1.58$'
is: [
  closed_set,
  compact,
  path_connected,
  measure_zero,
  uncountable
]
is_not: [simply_connected]
why:
  diameter: >-
    The diameter of the Sierpinski triangle is $1$, because the Sierpinski triangle contains the three corners of the first triangle, which are at distance $1$ from each other, and lies inside that triangle.
  cardinality: >-
    The cardinality of the Sierpinski triangle is $\mathfrak{c}$, because the Sierpinski triangle contains a segment, the bottom side of the first triangle, and lies in $\reals^2$.
  lebesgue_measure: >-
    The Lebesgue measure (area) of the Sierpinski triangle is $0$, because each step of the construction keeps $3/4$ of the area, and $(3/4)^n \to 0$.
  hausdorff_dimension: >-
    The Hausdorff dimension of the Sierpinski triangle is $\log 3 / \log 2$, because the Sierpinski triangle consists of $3$ copies of itself, each scaled down by a factor of $2$, so $3 = 2^d$.
  closed_set: >-
    The Sierpinski triangle is closed, because it is the intersection of the sets that remain after each step of the construction, and each of these sets is a union of finitely many closed triangles.
  compact: >-
    The Sierpinski triangle is compact, because it is closed and bounded in $\reals^2$.
  path_connected: >-
    The Sierpinski triangle is path connected, because the sides of all of the triangles in its construction lie in the Sierpinski triangle.
    Each point of the Sierpinski triangle lies in smaller and smaller triangles of the construction, and a path from a corner of the first triangle can run along the sides of these triangles, from corner to corner, and reach the point in the limit.
  measure_zero: >-
    The Sierpinski triangle has measure zero, because its area is $0$.
  uncountable: >-
    The Sierpinski triangle is uncountable, because it contains a segment.
  simply_connected: >-
    The Sierpinski triangle is not simply connected, because a loop around one of the removed triangles cannot be shrunk to a point without passing through the hole.
---
