---
title: '$[0, 1]$'
level: high-school
values:
  arc_length: '$1$'
  diameter: '$1$'
  cardinality: '$\mathfrak{c}$'
  lebesgue_measure: '$1$'
  hausdorff_dimension: '$1$'
  interior: '$\operatorname{int} [0, 1] = (0, 1)$'
  boundary: '$\partial [0, 1] = \setdef{0, 1}$'
  exterior: '$\operatorname{ext} [0, 1] = (-\infty, 0) \cup (1, \infty)$'
  closure: '$\overline{[0, 1]} = [0, 1]$'
is: [
  closed_set,
  compact,
  sequentially_compact,
  locally_compact,
  paracompact,
  bounded,
  infinite_set,
  uncountable
]
is_not: [
  open_set,
  finite_set,
  countably_infinite,
  countable
]
why:
  closure: >-
    The closure of $[0, 1]$ is $[0, 1]$ itself, because $[0, 1]$ is closed.
  closed_set: >-
    The interval $[0, 1]$ is closed in $\reals$, because it contains its boundary points $0$ and $1$.
  open_set: >-
    The interval $[0, 1]$ is not open in $\reals$, because every interval around $0$ contains negative numbers, which are not in $[0, 1]$.
  arc_length: >-
    The arc length of $[0, 1]$, as a straight segment, is its length, $1 - 0 = 1$.
  diameter: >-
    The diameter of $[0, 1]$ is $1$, the distance between its endpoints.
  cardinality: >-
    The cardinality of $[0, 1]$ is $\mathfrak{c}$, the same as that of $\reals$, because Cantor's diagonal argument shows that $[0, 1]$ is uncountable, and $[0, 1]$ is in bijection with $\reals$.
  lebesgue_measure: >-
    The Lebesgue measure of $[0, 1]$ is its length, $1$.
  hausdorff_dimension: >-
    The Hausdorff dimension of $[0, 1]$ is $1$, as for every segment.
  interior: >-
    The interior of $[0, 1]$ is $(0, 1)$, because no interval around $0$ or $1$ stays inside $[0, 1]$.
  boundary: >-
    The boundary of $[0, 1]$ is $\setdef{0, 1}$, because every interval around $0$ or $1$ contains points inside and outside $[0, 1]$.
  exterior: >-
    The exterior of $[0, 1]$ is everything outside $[0, 1]$, because each of those points has a small interval around it that misses $[0, 1]$.
  uncountable: >-
    $[0, 1]$ is uncountable because Cantor's diagonal argument shows that no list of numbers in $[0, 1]$ contains them all.
  compact: >-
    $[0, 1]$ is compact because it is closed and bounded in $\reals$.
  finite_set: >-
    $[0, 1]$ is not finite, because it has infinitely many elements.
  countable: >-
    $[0, 1]$ is not countable, because it is uncountable.
  sequentially_compact: >-
    $[0, 1]$ is sequentially compact (as a compact metric space), locally compact, and paracompact, because it is compact.
  bounded: >-
    $[0, 1]$ is compact because it is closed and bounded.
  infinite_set: >-
    $[0, 1]$ is uncountable, and so infinite, because Cantor's diagonal argument shows it cannot be listed.
  countably_infinite: >-
    $[0, 1]$ is not countably infinite, because it is uncountable.
---
