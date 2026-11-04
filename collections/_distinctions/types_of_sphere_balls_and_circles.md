---
published: false
title: Circle vs. sphere vs. ball vs. open and closed balls
kind: family
areas: [geometry, topology]
status: draft
summary: >
  A sphere is hollow and a ball is solid.
  A circle is a sphere in the plane.
  A closed ball includes its bounding sphere, and an open ball does not.
  In topology, any shape that can be continuously deformed into a sphere counts as a topological sphere.
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
      The surface of a basketball is a sphere, and so a topological sphere, because it consists of the points at one distance from the center.
      It is not a ball, because it does not include the inside.
  - example: a_solid_bowling_ball
    why: >-
      A solid bowling ball is a closed ball, and so a ball, because it includes the inside and the surface.
      It is not a sphere, which would be only the surface.
  - example: set_x_y_x_squared_plus_y_squared_lt_1
    why: >-
      $\lbrace (x, y) : x^2 + y^2 < 1 \rbrace$ is the open unit disk, an open ball (and so a ball) in $\reals^2$.
      It is not a closed ball, because it leaves out the circle, and it is not a circle, because it includes the inside.
  - example: set_x_y_x_squared_plus_y_squared_eq_1
    why: >-
      $\lbrace (x, y) : x^2 + y^2 = 1 \rbrace$ is the unit circle, which is also the unit sphere in $\reals^2$, and so a topological circle and sphere.
      It is not a ball, because it does not include the inside.
  - example: the_boundary_of_a_square
    why: >-
      The boundary of a square is a topological circle, because it can be continuously deformed into a circle.
      It is not a circle, because its points are not all at the same distance from the center.
  - example: the_surface_of_a_cube
    why: >-
      The surface of a cube is a topological sphere, because it can be inflated into a sphere.
      It is not a sphere, because its points are not all at the same distance from the center.
  - example: set_x_y_max_x_y_eq_1
    why: >-
      This square is the unit sphere for the max-norm distance, so it is a sphere in that metric space, and so a topological sphere.
      It is not a circle, because its points are not all at the same Euclidean distance from the origin.
see_also:
  - types_of_inside
  - boundary_vs_edge
---
## Different norms give different "spheres"

Spheres and balls depend on the metric.
In $\reals^2$, the unit sphere for the Euclidean norm is a circle, the unit sphere for the max norm $\max(\lvert x \rvert, \lvert y \rvert)$ is a square, and the unit sphere for the taxicab norm $\lvert x \rvert + \lvert y \rvert$ is a diamond.

## Circles, spheres, and hyperspheres

$S^n$ denotes the $n$-dimensional unit sphere in $\reals^{n+1}$.
The circle is $S^1$, the ordinary sphere is $S^2$, and $S^3 \subseteq \reals^4$ is sometimes called a hypersphere (or $3$-sphere).
