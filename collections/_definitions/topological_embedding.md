---
published: false
title: Topological Embedding
term: topological embedding
applies_to: functions between topological spaces
synonyms: [embedding (in topology)]
levels:
  high-school:
    text: |-
      A _topological embedding_ places one shape inside another without tearing or gluing it, so the copy inside has the same shape as the original.
      For example, drawing a circle in the plane, or tying a loop of string into a knot in space, embeds a circle.
      Bending a line segment around until its two ends meet does not embed the segment, because the two ends get glued together.
  undergraduate:
    context: topological spaces
    text: |-
      Consider topological spaces $X$ and $Y$ and a function $f : X \to Y$.
      Give the [range](/dictionary/definitions/range-image) $f(X)$ the [subspace topology](/dictionary/definitions/subspace-topology) from $Y$.
      The function $f$ is a _topological embedding_ if $f$ is a [homeomorphism](/dictionary/definitions/homeomorphism) from $X$ onto $f(X)$.
properties:
  - >-
    Every topological embedding is [continuous](/dictionary/definitions/continuous) and [injective](/dictionary/definitions/injective).
  - >-
    For a subset $A$ of a topological space $Y$ with the subspace topology, the [inclusion map](/dictionary/definitions/inclusion-map) $\iota : A \hookrightarrow Y$ is a topological embedding.
---
A continuous injective function need not be a topological embedding, because the inverse of $f$ on $f(X)$ need not be continuous.

In differential geometry, a _smooth embedding_ is a topological embedding that is also a smooth immersion.
