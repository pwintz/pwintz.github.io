---
published: false
title: Compact set
term: compact
applies_to: sets and spaces
levels:
  high-school:
    context: subsets of $\reals^n$
    text: |-
      Consider a set of points in the plane or in space.
      The set is _compact_ if it is [closed](/dictionary/definitions/closed-set) and [bounded](/dictionary/definitions/bounded).
    caveat: >-
      "Closed and [bounded](/dictionary/definitions/bounded)" is equivalent to compact in $\reals^n$ (the Heine–Borel theorem), but not in general.
      The closed unit [ball](/dictionary/definitions/ball) of an infinite-dimensional [Hilbert space](/dictionary/definitions/hilbert-space) is closed and bounded, but not compact.
  undergraduate:
    context: metric spaces
    text: |-
      Consider a set $K$ in a [metric space](/dictionary/definitions/metric-space).
      The set $K$ is _compact_ if

      1. $K$ is complete: every Cauchy [sequence](/dictionary/definitions/sequence) of points of $K$ converges to a point of $K$, and
      2. $K$ is totally [bounded](/dictionary/definitions/bounded): for every $\varepsilon > 0$, finitely many [balls](/dictionary/definitions/ball) of radius $\varepsilon$ cover $K$.
    caveat: >-
      In a general topological space, there is no distance, so "complete" and "totally [bounded](/dictionary/definitions/bounded)" have no meaning; compactness is defined with open covers instead.
  graduate:
    context: topological spaces
    text: |-
      Consider a set $K$ in a topological space, and the open covers of $K$: collections of [open sets](/dictionary/definitions/open-set) whose [union](/dictionary/definitions/set-union) contains $K$.
      The set $K$ is _compact_ if every open cover of $K$ has a finite subcover.
properties:
  - >-
    In a [metric space](/dictionary/definitions/metric-space), a set is compact if and only if it is [sequentially compact](/dictionary/definitions/sequentially-compact): every [sequence](/dictionary/definitions/sequence) in the set has a subsequence that converges to a point of the set.
    In a general topological space, neither property implies the other.
  - >-
    In a [metric space](/dictionary/definitions/metric-space), the definitions agree: a set is complete and totally bounded if and only if every open cover of the set has a finite subcover.
    In $\reals^n$, both are equivalent to being [closed](/dictionary/definitions/closed-set) and [bounded](/dictionary/definitions/bounded).
  - >-
    A [continuous](/dictionary/definitions/continuous) image of a compact set is compact.
    In particular, a continuous real-valued function on a nonempty compact set attains a maximum and a minimum (the extreme value theorem).
  - >-
    A closed [subset](/dictionary/definitions/subset) of a compact set is compact, and a compact subset of a [Hausdorff](/dictionary/definitions/hausdorff-space) space is closed.
---
