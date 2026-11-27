---
title: 'The set of rational numbers, $\rationals$'
level: high-school
is: [
  paracompact,
  measure_zero,
  dense_set,
  countable,
  meager_set,
  first_countable,
  second_countable
]
is_not: [
  compact,
  sequentially_compact,
  locally_compact,
  nowhere_dense,
  uncountable
]
why:
  paracompact: >-
    $\rationals$ is paracompact because it is a metric space.
  measure_zero: >-
    $\rationals$ has measure zero, because it is countable.
  nowhere_dense: >-
    $\rationals$ is not nowhere dense, because it is dense in $\reals$.
  sequentially_compact: >-
    $\rationals$ is not sequentially compact, because the sequence $1, 2, 3, \dots$ in $\rationals$ has no convergent subsequence.
  meager_set: >-
    $\rationals$ is meager, because it is a countable union of single points, and each point is nowhere dense in $\reals$.
  first_countable: >-
    $\rationals$, as a subspace of $\reals$, is first countable, because, at each point $q$, the sets of rational numbers in $(q - 1/k, q + 1/k)$ form a countable neighborhood basis.
  second_countable: >-
    $\rationals$, as a subspace of $\reals$, is second countable, because the sets of rational numbers in open intervals with rational endpoints form a countable basis.
  locally_compact: >-
    $\rationals$ is not locally compact, because no neighborhood of a point has a compact closure: every interval of rational numbers misses irrational limits of its points.
  compact: >-
    $\rationals$ is not compact, because it is not bounded.
---
