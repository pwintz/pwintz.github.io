---
title: Path-Connected Space
term: path-connected
applies_to: sets and topological spaces
synonyms: [arcwise connected]
levels:
  elementary:
    text: |-
      Think of a shape drawn on paper, and imagine walking around inside it.
      The shape is _path-connected_ if you can walk from any point of it to any other point without leaving it.
  undergraduate:
    context: topological spaces
    text: |-
      Consider a topological space $X$.
      The space $X$ is _path-connected_ if, for every two points $x, y \in X$, there is a [continuous](/dictionary/definitions/continuous) path $\gamma : [0, 1] \to X$ such that $\gamma(0) = x$ and $\gamma(1) = y$.
properties:
  - |-
    Every path-connected space is [connected](/dictionary/definitions/connected), but not every connected space is path-connected.
  - |-
    An open [subset](/dictionary/definitions/subset) of $\reals^n$ is path-connected if and only if it is [connected](/dictionary/definitions/connected).
---
