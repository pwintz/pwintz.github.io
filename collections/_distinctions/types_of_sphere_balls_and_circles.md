---
published: false
title: Circle vs. sphere vs. ball vs. open and closed balls
kind: family
areas: [geometry, topology]
status: draft
summary: >
  A sphere is hollow and a ball is solid. A circle is a sphere in the plane.
  A closed ball includes its bounding sphere, and an open ball does not. In topology, any shape that can be continuously deformed into a sphere counts as a topological sphere.
terms:
  - circle
  - sphere
  - ball
  - open_ball
  - closed_ball
  - circle_topological
  - sphere_topological
examples:
  - example: the_surface_of_a_basketball
    why: >-
      Only the surface, not the inside.
  - example: a_solid_bowling_ball
    why: >-
      It includes the inside and the surface.
  - example: set_x_y_x_squared_plus_y_squared_lt_1
    why: >-
      It is the open unit disk, an open ball in $\reals^2$.
  - example: set_x_y_x_squared_plus_y_squared_eq_1
    why: >-
      The unit circle is the unit sphere in $\reals^2$.
  - example: the_boundary_of_a_square
    why: >-
      It can be continuously deformed into a circle, but it has corners.
  - example: the_surface_of_a_cube
    why: >-
      It can be inflated into a sphere, but its points are not all the same distance from a center.
  - example: set_x_y_max_x_y_eq_1
    why: >-
      It is the unit sphere for the max-norm distance, so it is a sphere in that metric space, but it is a square, not a circle.
see_also:
  - types_of_inside
  - boundary_vs_edge
---
## Different norms give different "spheres"

Spheres and balls depend on the metric. In $\reals^2$, the unit sphere for the Euclidean norm is a circle, the unit sphere for the max norm $\max(\lvert x \rvert, \lvert y \rvert)$ is a square, and the unit sphere for the taxicab norm $\lvert x \rvert + \lvert y \rvert$ is a diamond.

## Circles, spheres, and hyperspheres

$S^n$ denotes the $n$-dimensional unit sphere in $\reals^{n+1}$. The circle is $S^1$, the ordinary sphere is $S^2$, and $S^3 \subseteq \reals^4$ is sometimes called a hypersphere (or $3$-sphere).
