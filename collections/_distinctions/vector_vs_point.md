---
title: Vector vs. point
kind: siblings
areas: [linear-algebra, geometry]
summary: >
  A point is a location.
  A vector is a displacement, defined by the operations of addition and scaling.
  The difference of two points is a vector. 
  Two vectors can be added, and a vector can be added to a point, but the sum of two points is not meaningful.
terms:
  - vector
  - point
examples:
  - example: the_location_of_paris
    why: >-
      The location of Paris is a point.
      It is not a vector, because adding the locations of Paris and the location of another city, such as Rome, has no meaning.
  - example: the_displacement_from_paris_to_rome
    why: >-
      The displacement from Paris to Rome is a vector, because it has a magnitude (the distance between the cities) and a direction.
      It is not a point, because it is not a single location. 
  - example: 2_3_in_reals_squared
    why: >-
      $(2, 3)$ is a point of $\reals^2$, and it is a vector, because $\reals^2$ has a distinguished origin, $(0, 0)$, so each point can be identified with the vector from the origin.
see_also:
  - vector_vs_vector_coordinate
  - vector_vs_covector
---
## Notes

- An affine combination of points, $\lambda p + (1 - \lambda) q$, is meaningful because it equals $q + \lambda (p - q)$.
  For example, the midpoint of $p$ and $q$ is $\frac{1}{2} p + \frac{1}{2} q$.
- In physics, positions are points and velocities are vectors.
  Changing the origin changes the coordinates of positions but not of velocities.
