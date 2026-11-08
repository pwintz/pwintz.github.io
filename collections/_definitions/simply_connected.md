---
published: false
title: Simply connected space
term: simply connected
applies_to: sets and topological spaces
levels:
  high-school:
    text: |-
      Consider a shape that is in one piece, and loops drawn inside it.
      The shape is _simply connected_ if every such loop can be shrunk to a point without leaving the shape.
  undergraduate:
    context: topological spaces
    text: |-
      Consider a [path-connected](/definitions/path-connected) topological space $X$, and the loops in $X$: [continuous](/definitions/continuous) maps $\gamma : [0, 1] \to X$ such that $\gamma(0) = \gamma(1)$.
      The space $X$ is _simply connected_ if every loop can be continuously deformed, within $X$, to a constant loop.
properties:
  - |-
    Equivalently, $X$ is [path-connected](/definitions/path-connected) and its fundamental group is trivial.
  - |-
    A [connected](/definitions/connected) open [subset](/definitions/subset) of the plane is simply connected if and only if it has no holes: its complement has no [bounded](/definitions/bounded) piece.
  - |-
    Having "no holes" does not mean being solid.
    The surface of a [sphere](/definitions/sphere) is hollow, but it is simply connected, since every loop on it can slide off to a point.
---
