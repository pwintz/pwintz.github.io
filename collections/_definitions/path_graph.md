---
title: Path in a Graph
term: path (in a graph)
applies_to: graphs (networks)
levels:
  elementary:
    text: |-
      Imagine a network drawn as dots joined by lines, like a map of cities and roads.
      A _path_ is a route that goes from dot to dot along the lines and never visits the same dot twice.
  undergraduate:
    context: graph theory
    text: |-
      Consider a [graph](/dictionary/definitions/graph-network) $G = (V, E)$.
      A _path_ in $G$ is a sequence $v_0, v_1, \dots, v_k$ of distinct vertices such that each pair of consecutive vertices is joined by an [edge](/dictionary/definitions/edge-graph):

      $$\setdef{v_{i - 1}, v_i} \in E \quad \text{for } i = 1, 2, \dots, k.$$

      The path starts at $v_0$ and ends at $v_k$.
      The _length_ of the path is $k$, which is the number of edges that the path uses.
properties:
  - >-
    A graph is [connected](/dictionary/definitions/connected-graph) if every two vertices of the graph are joined by a path.
---
A sequence of vertices joined by edges that may visit a vertex more than once is called a _walk_.

In [topology](/dictionary/definitions/topology), a [path](/dictionary/definitions/path-continuous) is a [continuous](/dictionary/definitions/continuous) function from $[0, 1]$ into a space, which is a different object; see [continuous path vs. path in a graph](/dictionary/distinctions/path-continuous-vs-path-graph).
