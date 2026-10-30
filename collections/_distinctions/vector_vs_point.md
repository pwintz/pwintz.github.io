---
published: false
title: Vector vs. point
kind: siblings
areas: [linear-algebra, geometry]
status: draft
summary: >
  A point is a location. A vector is a displacement, defined by the operations of addition and scaling.
  The difference of two points is a vector, but the sum of two points is not meaningful.
terms:
  - vector
  - point
examples:
  - example: the_location_of_paris
    why: >-
      Adding the locations of Paris and Rome has no meaning.
  - example: the_displacement_from_paris_to_rome
    why: >-
      It can be added to another displacement or scaled.
  - example: 2_3_in_reals_squared
    why: >-
      $\reals^2$ has a distinguished origin, so each point can be identified with the vector from the origin.
see_also:
  - vector_vs_vector_coordinate
  - vector_vs_covector
---
## Notes

- An affine combination of points, $\lambda p + (1 - \lambda) q$, is meaningful because it equals $q + \lambda (p - q)$. For example, the midpoint of $p$ and $q$ is $\frac{1}{2} p + \frac{1}{2} q$.
- In physics, positions are points and velocities are vectors. Changing the origin changes the coordinates of positions but not of velocities.
