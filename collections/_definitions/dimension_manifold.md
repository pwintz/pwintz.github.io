---
title: Dimension (of a Manifold)
term: dimension (of a manifold)
applies_to: manifolds
levels:
  # TODO: Make this definition more intuitive.
  # undergraduate:
  #   text: |-
  #     Consider a [manifold](/dictionary/definitions/manifold) $M$, such as a curve or a surface.
  #     The _dimension_ of $M$ is the number $n$ such that each point of $M$ has a [neighborhood](/dictionary/definitions/neighborhood) that looks like an open piece of $\reals^n$.
  graduate:
    context: topology
    text: |-
      Consider a nonempty [manifold](/dictionary/definitions/manifold) $M$.
      The _dimension_ of $M$ is the number $n$ such that every point of $M$ has an [open neighborhood](/dictionary/definitions/open-neighborhood) that is [homeomorphic](/dictionary/definitions/homeomorphism) to an open [subset](/dictionary/definitions/subset) of $\reals^n$.
properties:
  - |-
    The dimension of a [manifold](/dictionary/definitions/manifold) is well defined, because a nonempty open [subset](/dictionary/definitions/subset) of $\reals^m$ is not homeomorphic to a nonempty open subset of $\reals^n$ when $m \neq n$ (invariance of domain).
  - |-
    The dimension of a [manifold](/dictionary/definitions/manifold) $M$ equals the number of coordinates in each [chart](/dictionary/definitions/chart-manifold) on $M$.
  - |-
    The [vector space](/dictionary/definitions/vector-space) $\reals^n$ is a [manifold](/dictionary/definitions/manifold) of dimension $n$, so its dimension as a manifold equals its [dimension as a vector space](/dictionary/definitions/dimension-vector-space).
---
A curve has dimension $1$ and a surface has dimension $2$, even when the curve or surface sits inside a higher-dimensional space, such as $\reals^3$.
