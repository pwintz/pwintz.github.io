---
title: Basis vs. Coordinate System
kind: hierarchy
areas: [linear-algebra, geometry]
relation:
  - context: On a vector space
    relation: basis ⊂ coordinate system
  - context: On a set of points, such as the plane
    relation: basis + origin ⊂ coordinate system
summary: >
  A basis and a coordinate system each describe objects by lists of numbers, and some linear algebra texts use "coordinate system" as another name for a basis.
  A [basis](/dictionary/definitions/vector-basis) is a set of vectors in a [vector space](/dictionary/definitions/vector-space); each vector gets its coordinates by being written as a [linear combination](/dictionary/definitions/linear-combination) of the basis vectors.
  A [coordinate system](/dictionary/definitions/coordinate-system) is a rule that labels each point of a set with a list of numbers, where the set need not be a vector space and the coordinate curves need not be straight, as in polar coordinates.
  A basis alone gives coordinates to vectors, not to points; a coordinate system on a set of points, such as the plane, needs a basis plus an origin, and each point gets the coordinates of the vector from the origin to that point.
  In a vector space, the [zero vector](/dictionary/definitions/zero-vector) serves as the origin, so every basis of a vector space determines a coordinate system on that vector space.
  Many coordinate systems do not come from a basis and an origin.
terms:
  - vector_basis
  - coordinate_system
examples:
  - example: standard_basis_r2
  - example: cartesian_coordinates_on_plane
  - example: polar_coordinates_on_plane
  - example: latitude_and_longitude
see_also:
  - vector_vs_vector_coordinate
  - vector_vs_point
---
