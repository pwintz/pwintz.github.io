---
published: false
title: Connected Graph
term: connected (graph)
applies_to: graphs (networks)
levels:
  elementary:
    text: |-
      Imagine a network drawn as dots joined by lines, like a map of cities and roads.
      The network is _connected_ if you can travel from each dot to every other dot by following the lines.
  undergraduate:
    context: graph theory
    text: |-
      Consider a [graph](/dictionary/definitions/graph-network) $G = (V, E)$.
      The graph $G$ is _connected_ if for every two vertices $u, v \in V$, there is a [path](/dictionary/definitions/path-graph) in $G$ from $u$ to $v$.
properties:
  - >-
    A connected graph with $n$ vertices has at least $n - 1$ [edges](/dictionary/definitions/edge-graph).
---
In [topology](/dictionary/definitions/topology), a [connected space](/dictionary/definitions/connected) is a space that cannot be split into two disjoint, nonempty [open sets](/dictionary/definitions/open-set), which is a different definition.
The two definitions agree on drawings: when a graph is drawn with each edge drawn as a curve, the graph is connected exactly when the drawing is connected as a [subset](/dictionary/definitions/subset) of the plane.
