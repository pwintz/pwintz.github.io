---
published: false
title: "Dimension: physical quantity vs. vector space vs. number of axes"
kind: conflicting
areas: [linear-algebra, language, computing]
status: draft
summary: >
  The dimension of a vector space counts independent directions. The dimension of a physical quantity is its kind, such as length or time.
  In programming, the "number of dimensions" of an array is its number of axes.
terms:
  - physical_dimension
  - dimension_vector_space
  - array_rank
examples_note: >-
  Each cell is the dimension of the object in that row, in the ___ sense.
examples:
  - example: reals_cubed
    why: >-
      A basis of $\reals^3$ has $3$ vectors.
  - example: distance_in_meters
    why: >-
      Meters are a unit of length.
  - example: vector_123_array
    why: >-
      NumPy calls this `ndim`, the number of dimensions, even though the vector lies in the three-dimensional space $\reals^3$.
see_also:
  - units_vs_dimension
  - types_of_array_quantities
  - types_of_size
---
## Other meanings

- The dimension of a manifold is the dimension of the space it locally looks like. For example, a sphere in $\reals^3$ is two-dimensional.
- The Hausdorff dimension of a fractal, such as the Cantor set, need not be an integer.
- The "dimensions" of an $m \times n$ matrix are $m$ and $n$, which is its shape.
