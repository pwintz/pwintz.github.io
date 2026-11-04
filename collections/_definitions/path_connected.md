---
published: false
title: Path-connected space
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
      Consider a topological space $X$, and paths in it: [continuous](/definitions/continuous) maps $\gamma : [0, 1] \to X$.
      The space $X$ is _path-connected_ if, for any two points $x, y \in X$, there is a path with $\gamma(0) = x$ and $\gamma(1) = y$.
properties:
  - |-
    Every path-connected space is [connected](/definitions/connected), but not every connected space is path-connected.
  - |-
    An open subset of $\reals^n$ is path-connected if and only if it is connected.
---
