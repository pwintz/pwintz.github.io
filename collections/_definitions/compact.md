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
      The set is _compact_ if it is closed and [bounded](/definitions/bounded).
    caveat: >-
      "Closed and [bounded](/definitions/bounded)" is equivalent to compact in $\reals^n$ (the Heine–Borel theorem), but not in general.
      The closed unit [ball](/definitions/ball) of an infinite-dimensional [Hilbert space](/definitions/hilbert-space) is closed and bounded, but not compact.
  undergraduate:
    context: metric spaces
    text: |-
      Consider a set $K$ in a metric space, and the [sequences](/definitions/sequence) of points of $K$.
      The set $K$ is _compact_ if every such sequence has a subsequence that converges to a point of $K$.
  graduate:
    context: topological spaces
    text: |-
      Consider a set $K$ in a topological space, and the open covers of $K$: collections of open sets whose union contains $K$.
      The set $K$ is _compact_ if every open cover of $K$ has a finite subcover.
properties:
  - >-
    A [subset](/definitions/subset) of a [metric space](/definitions/metric-space) is compact if and only if it is complete and totally [bounded](/definitions/bounded).
  - >-
    A [continuous](/definitions/continuous) image of a compact set is compact.
    In particular, a continuous real-valued function on a nonempty compact set attains a maximum and a minimum (the extreme value theorem).
  - >-
    A closed [subset](/definitions/subset) of a compact set is compact, and a compact subset of a [Hausdorff](/definitions/hausdorff-space) space is closed.
---
