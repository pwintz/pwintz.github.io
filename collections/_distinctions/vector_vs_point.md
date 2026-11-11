---
title: Vector vs. point
kind: siblings
areas: [linear-algebra, geometry]
summary: >
  Points and vectors are both written as lists of coordinates in $\reals^n$, but they behave differently.
  A point is a location.
  A vector is a [displacement](/dictionary/definitions/displacement), defined by the operations of addition and scaling.
  The difference of two points is a vector. 
  Two vectors can be added, and a vector can be added to a point, but the sum of two points is not meaningful.
terms:
  - vector
  - point
examples:
  - example: the_location_of_paris
  - example: the_displacement_from_paris_to_rome
  - example: 2_3_in_R2
see_also:
  - vector_vs_vector_coordinate
  - vector_vs_covector
---
## Notes

- An [affine](/dictionary/definitions/affine-system) combination of points, $\lambda p + (1 - \lambda) q$, is meaningful because it equals $q + \lambda (p - q)$.
  For example, the midpoint of $p$ and $q$ is $\frac{1}{2} p + \frac{1}{2} q$.
- In physics, positions are points and velocities are vectors.
  Changing the origin changes the coordinates of positions but not of velocities.
