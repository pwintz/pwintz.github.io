---
title: 'The unit circle'
level: high-school
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.6, 1.6]
    y: [-1.6, 1.6]
    shapes:
      - { circle: [0, 0, 1] }
  caption: |-
    The unit circle $x^2 + y^2 = 1$.
  alt: "A circle of radius 1 around the origin."
detail: |-
  The unit circle is the set of points $(x, y)$ in the plane such that

  $$x^2 + y^2 = 1.$$
is: [
  curve,
  circle,
  connected,
  path_connected
]
is_not: [
  graph_of_function,
  function,
  simply_connected
]
values:
  dimension_manifold: '$1$'
  dimension_vector_space: 'None'
why:
  dimension_manifold: >-
    The dimension of the unit circle $x^2 + y^2 = 1$ as a manifold is $1$, because the angle $\theta$ is a coordinate on each arc of the circle shorter than the full circle.
  dimension_vector_space: >-
    The unit circle $x^2 + y^2 = 1$ has no dimension as a vector space, because it is not a vector space: it does not contain the zero vector.
  simply_connected: >-
    The unit circle is not simply connected, because the circle itself is a loop that cannot be shrunk to a point within the circle.
  curve: >-
    The unit circle is a curve, because it is the image of the continuous map $t \mapsto (\cos t, \sin t)$ on $[0, 2\pi]$.
  connected: >-
    The unit circle is connected, because it is path-connected, and every path-connected set is connected.
  path_connected: >-
    The unit circle is path-connected, because every two points are joined by an arc of the circle.
  graph_of_function: >-
    The unit circle $x^2 + y^2 = 1$ is not the graph of a function of $x$, because it fails the vertical line test.
  function: >-
    The unit circle $x^2 + y^2 = 1$ is not a function, because it is a set of points, not a rule.
---
