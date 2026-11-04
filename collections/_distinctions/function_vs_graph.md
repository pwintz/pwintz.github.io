---
published: false
title: Function vs. graph vs. curve
kind: siblings
areas: [sets]
status: draft
summary: >
  A function assigns outputs to inputs.
  Its graph is the set of input-output pairs.
  A curve is a one-dimensional shape, which may or may not be the graph of a function.
terms:
  - function
  - graph_of_function
  - curve
examples:
  - example: x_to_x_squared
    why: >-
      $x \mapsto x^2$ is a function because it is a rule that assigns one output to each input.
      It is not a graph or a curve, because it is a rule, not a set of points.
  - example: set_x_x_squared_x_in_reals
    why: >-
      $\lbrace (x, x^2) : x \in \reals \rbrace$ is the graph of the function $x \mapsto x^2$, and it is a curve (the parabola).
      It is not a function itself, because it is a set of points, not a rule.
  - example: the_unit_circle_x_squared_plus_y_squared_eq_1
    why: >-
      The unit circle is a curve.
      It is not the graph of a function of $x$, because it fails the vertical line test, and it is not a function, because it is a set of points.
  - example: t_to_cos_t_sin_t
    why: >-
      $t \mapsto (\cos t, \sin t)$ is a function from $\reals$ into the plane, and it is a curve because it is a parametrized path, whose image is the unit circle.
      It is not a graph of a function, because it is a rule, not a set of points.
see_also:
  - domain_vs_codomain_vs_image
  - types_of_illustrations
---
## Fine print

- It is common to say "plot the function," but what is meant is "plot the graph of the function."
- In set theory, a function is _defined_ as its graph (a set of pairs), so the distinction is between a rule and a set only informally.
- "Graph" also means a network of vertices and edges, or any chart, which are unrelated.
  See [the meanings of "graph"](/distinctions/meanings-of-graph).
