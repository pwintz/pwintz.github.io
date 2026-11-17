---
title: "Path: Continuous Path vs. Path in a Graph"
kind: conflicting
areas: [topology, sets]
summary: >
  "Path" has two common meanings, one in [topology](/dictionary/definitions/topology) and one in graph theory.
  A [continuous path](/dictionary/definitions/path-continuous) is a [continuous](/dictionary/definitions/continuous) function $\gamma : [0, 1] \to X$ into a topological space $X$, so a continuous path passes through infinitely many points, unless the path stays at one point.
  A [path in a graph](/dictionary/definitions/path-graph) is a finite sequence of distinct vertices such that each pair of consecutive vertices is joined by an edge.
terms:
  - path_continuous
  - path_graph
examples_note: >-
  Is the object a path in the ___ sense?
examples:
  - example: the_half_circle_cos_pi_s_sin_pi_s_for_s_in_0_1
  - example: vertices_a_b_c_in_the_triangle_graph
  - example: vertices_a_b_a_in_the_triangle_graph
see_also:
  - trajectory_vs_path_vs_orbit_vs_flow
  - meanings_of_graph
---
## Notes

- The two meanings share a picture: when a graph is drawn in the plane with each edge drawn as a curve, a path in the graph traces a [continuous](/dictionary/definitions/continuous) path through the drawing, from the first vertex to the last.
- A continuous path may cross itself, but a path in a graph visits each vertex at most once.
  A sequence of vertices joined by edges that may repeat vertices is called a _walk_.
