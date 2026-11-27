---
published: false
title: 'The Sorgenfrey line (the reals with half-open intervals $[a, b)$ as a base)'
level: graduate
is: [
  T1_space,
  hausdorff_space,
  normal_space,
  first_countable
]
is_not: [
  metrizable,
  countable,
  second_countable
]
why:
  metrizable: >-
    The Sorgenfrey line is not metrizable, because it is separable but not second countable, which is impossible for a metric space.
  hausdorff_space: >-
    The Sorgenfrey line is Hausdorff, because two points $x < y$ have the disjoint neighborhoods $[x, y)$ and $[y, y + 1)$.
  countable: >-
    The Sorgenfrey line is not countable, because its points are the real numbers.
  first_countable: >-
    The Sorgenfrey line is first countable, because, at each point $x$, the intervals $[x, x + 1/k)$ form a countable neighborhood basis.
  second_countable: >-
    The Sorgenfrey line is not second countable.
    Every basis contains, for each $x$, a set $B_x$ such that $x \in B_x \subseteq [x, x + 1)$, so $x$ is the smallest element of $B_x$, and the sets $B_x$ are all different.
    So every basis has uncountably many sets.
  T1_space: >-
    The Sorgenfrey line is T₁, because it is Hausdorff.
---
