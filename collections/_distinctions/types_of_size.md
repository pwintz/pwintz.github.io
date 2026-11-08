---
published: false
title: Size, length, area, volume, diameter, cardinality, dimension, and measure
kind: family
areas: [geometry, analysis]
summary: >
  "Size" is informal.
  Each technical term measures a different aspect of a set, and the same set can be large in one sense and small in another.
terms:
  - arc_length
  - area
  - volume
  - diameter
  - cardinality
  - lebesgue_measure
  - hausdorff_dimension
examples_note: >-
  Each cell is the size of the set in that row, in the sense of that column.
examples:
  - example: set_0_1
  - example: closed_unit_interval
  - example: rationals_intersect_0_1
    why: >-
      The rational numbers in $[0, 1]$ spread across the whole interval, so their diameter is $1$, but they are countable, so their measure and Hausdorff dimension are $0$.
  - example: the_cantor_set
    why: >-
      The Cantor set is large in cardinality (uncountable) and diameter, but small in measure ($0$), and its dimension is between $0$ and $1$.
  - example: set_x_y_x_squared_plus_y_squared_eq_1
    why: >-
      The unit circle has a positive arc length but zero area, because it is one-dimensional.
  - example: closed_unit_disk
  - example: box_2_by_3_by_4
    why: >-
      The surface area and the volume of the box measure different things: the area of its boundary and the size of the solid.
  - example: reals
    why: >-
      The real line $\reals$ is infinite in length and diameter, but it has the same cardinality as $[0, 1]$ and the same dimension.
see_also:
  - types_of_infinity
  - norm_vs_metric_vs_inner_product
  - types_of_sparsity
  - units_vs_dimension
---
## Notes

- The Cantor set shows that being [uncountable](/definitions/uncountable) and having [measure zero](/definitions/measure-zero) are compatible.
- Here, $\aleph_0$ is the [cardinality](/definitions/cardinality) of $\nats$ ([countably infinite](/definitions/countably-infinite)), and $\mathfrak{c}$ is the cardinality of $\reals$ (the continuum, which is uncountable).
- The dimension of a set here is its [Hausdorff dimension](/definitions/hausdorff-dimension), which differs from the [dimension of a vector space](/definitions/dimension-vector-space).
- "Area" of a [circle](/definitions/circle) usually means the area of the disk inside it.
- The [norm](/definitions/norm) of a vector is its length, which is different from the [arc length](/definitions/arc-length) of a curve and the measure of a set.
- "Amount" and "quantity" are not technical terms.
