---
title: '$\reals$ with the standard topology'
level: undergraduate
is: [
  T1_space,
  hausdorff_space,
  normal_space,
  metrizable,
  first_countable,
  second_countable
]
is_not: [countable]
why:
  metrizable: >-
    $\reals$ with the usual topology is metrizable, with the metric $\abs{x - y}$.
  hausdorff_space: >-
    $\reals$ with the usual topology is Hausdorff, because two distinct points $x < y$ have the disjoint neighborhoods $(-\infty, m)$ and $(m, \infty)$, where $m = (x + y)/2$.
  normal_space: >-
    $\reals$ with the usual topology is normal, because it is metrizable, and every metric space is normal.
  # TODO: Fix explanation.
  # T1_space: >-
  #   Every metric space is normal and Hausdorff, so it is T₁.
  countable: >-
    $\reals$ with the standard topology is not countable, by Cantor's diagonal argument.
  first_countable: >-
    $\reals$ with the standard topology is first countable, because, at each point $x$, the intervals $(x - 1/k, x + 1/k)$ form a countable neighborhood basis.
  second_countable: >-
    $\reals$ with the standard topology is second countable, because the open intervals with rational endpoints form a countable basis.
---
