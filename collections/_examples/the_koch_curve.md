---
published: false
title: 'The Koch curve'
level: undergraduate
description: >-
  Start with the segment from $(0, 0)$ to $(1, 0)$, and replace its middle third by the other two sides of an equilateral triangle that points up.
  Repeating this for each segment, forever, gives the Koch curve in the limit.
figure:
  widget: self-similar
  params: { shape: koch }
  caption: |-
    The first steps of the construction of the Koch curve, with its four copies in colors.
    Choose "A cover by small balls" to cover the set with balls of diameter $\delta$, and set the exponent $s$.
  alt: A jagged curve made of four parts in different colors, each a smaller copy of the whole. A slider sets the number of steps.
values:
  arc_length: '$\infty$'
  diameter: '$1$'
  lebesgue_measure: '$0$'
  hausdorff_dimension: '$\log 4 / \log 3 \approx 1.26$'
is: [
  curve,
  compact,
  path_connected,
  measure_zero
]
why:
  arc_length: >-
    The arc length of the Koch curve is infinite, because each step of the construction multiplies the length by $4/3$, and $(4/3)^n \to \infty$.
  diameter: >-
    The diameter of the Koch curve is $1$, the distance between its ends $(0, 0)$ and $(1, 0)$, because the Koch curve lies inside the triangle with the corners $(0, 0)$, $(1, 0)$, and $(1/2, \sqrt{3}/6)$, whose longest side is the segment from $(0, 0)$ to $(1, 0)$.
  lebesgue_measure: >-
    The Lebesgue measure (area) of the Koch curve is $0$.
    The Koch curve lies inside the triangle $T$ with the corners $(0, 0)$, $(1, 0)$, and $(1/2, \sqrt{3}/6)$, so it lies inside $4^n$ copies of $T$ scaled down by a factor of $3^n$, whose total area is $(4/9)^n$ times the area of $T$, and $(4/9)^n \to 0$.
  hausdorff_dimension: >-
    The Hausdorff dimension of the Koch curve is $\log 4 / \log 3$, because the Koch curve consists of $4$ copies of itself, each scaled down by a factor of $3$, so $4 = 3^d$.
  curve: >-
    The Koch curve is a curve, because the polygonal curves of the construction, each traced at a constant speed from $(0, 0)$ to $(1, 0)$, converge uniformly to a continuous path.
  compact: >-
    The Koch curve is compact, because it is the image of the interval $[0, 1]$ under a continuous map.
  path_connected: >-
    The Koch curve is path connected, because it is the image of a path.
  measure_zero: >-
    The Koch curve has measure zero in $\reals^2$, because its area is $0$.
---
