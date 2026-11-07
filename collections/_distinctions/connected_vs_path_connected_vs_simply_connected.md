---
published: false
title: Connected vs. path-connected vs. simply connected
kind: hierarchy
areas: [topology, analysis]
status: draft
summary: >
  Topology has several ways to say that a space is "in one piece," and some also rule out holes.
  A connected space is in one piece.
  A path-connected space is in one piece that you can travel across along a path.
  A simply connected space is path-connected and has no holes that a loop can wrap around.
relation: >
  simply connected ⊂ path-connected ⊂ connected
terms:
  - connected
  - path_connected
  - simply_connected
examples:
  - example: closed_unit_disk
    why: >-
      The closed unit disk is path-connected, and so connected, because the straight segment between two of its points stays in the disk.
      It is simply connected because every loop in it can be shrunk to a point.
  - example: the_surface_of_a_basketball
    why: >-
      The surface of a basketball is path-connected, and so connected, because any two points are joined by an arc of a great circle.
      It is simply connected because every loop on a sphere can be slid off to one side and shrunk to a point.
  - example: annulus
    why: >-
      The annulus is path-connected, and so connected, because any two points can be joined by a path that goes around the ring.
      It is not simply connected, because a loop around the hole cannot be shrunk to a point within the annulus.
  - example: the_unit_circle_x_squared_plus_y_squared_eq_1
    why: >-
      The unit circle is path-connected, and so connected, because any two points are joined by an arc of the circle.
      It is not simply connected, because the loop that goes once around the circle cannot be shrunk to a point within it.
  - example: two_intervals
    why: >-
      $[0, 1] \cup [2, 3]$ is not connected, because it splits into the two disjoint closed sets $[0, 1]$ and $[2, 3]$.
      So it is not path-connected or simply connected either.
  - example: topologist_sine_curve
    why: >-
      The topologist's sine curve is connected because the segment is in the closure of the graph, which is connected.
      It is not path-connected, because no path can travel from the segment to the graph through the infinitely many oscillations, so it is not simply connected either.
see_also:
  - types_of_compactness
  - types_of_sphere_balls_and_circles
---
