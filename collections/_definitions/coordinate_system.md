---
published: false
title: Coordinate system
term: coordinate system
applies_to: sets of points
synonyms: [coordinate chart, local coordinates]
levels:
  high-school:
    text: |-
      Consider a space of points, such as a plane.
      A _coordinate system_ on the space is a rule that labels each point of the space with a list of numbers, called its _coordinates_, such that different points get different lists.
  undergraduate:
    text: |-
      Consider a set $X$, such as a plane, a surface, or a region of space.
      A _coordinate system_ on $X$ is an [injective](/dictionary/definitions/injective) function $\varphi$ from $X$ to $\reals^n$.
      The entries of $\varphi(p)$ are the _coordinates_ of the point $p$.
  graduate:
    context: differential geometry
    text: |-
      Consider a manifold $M$ of dimension $n$ and an open [subset](/dictionary/definitions/subset) $U$ of $M$.
      A _coordinate system_ (or _chart_) on $U$ is a [homeomorphism](/dictionary/definitions/homeomorphism) $\varphi$ from $U$ to an open subset of $\reals^n$.
properties:
  - >-
    A [basis](/dictionary/definitions/vector-basis) $B$ of an $n$-dimensional [vector space](/dictionary/definitions/vector-space) $V$ gives a coordinate system $v \mapsto [v]_B$ on $V$, which sends each vector to its [coordinate vector](/dictionary/definitions/coordinate-vector).
    An origin and a basis together give a Cartesian (affine) coordinate system on a plane or on space.
  - >-
    The coordinate systems that come from an origin and a [basis](/dictionary/definitions/vector-basis) are exactly the ones whose coordinate functions are affine, so their coordinate curves are straight lines.
    Curvilinear coordinate systems, whose coordinate curves bend, come from no basis.
  - >-
    The surface of a [sphere](/dictionary/definitions/sphere) has no coordinate system that is a [homeomorphism](/dictionary/definitions/homeomorphism) onto an open [subset](/dictionary/definitions/subset) of $\reals^2$, so a manifold may need several charts to cover it.
---
Some linear algebra texts call a [basis](/dictionary/definitions/vector-basis) a "coordinate system," because a basis determines the coordinates of each vector.

In differential geometry, a coordinate system is often called a _chart_, which is unrelated to a [chart](/dictionary/definitions/chart) that presents data.
