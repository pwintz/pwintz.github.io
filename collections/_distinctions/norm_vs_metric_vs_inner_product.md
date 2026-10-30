---
published: false
title: Norm vs. metric vs. inner product
kind: hierarchy
areas: [linear-algebra, analysis]
status: draft
summary: >
  A norm measures the lengths of vectors, a metric measures distances between points, and an inner product measures both lengths and angles.
  An inner product gives a norm, and a norm gives a metric, but not the reverse.
relation: >
  An inner product gives a norm, $\lVert x \rVert = \sqrt{\langle x, x \rangle}$, and a norm gives a metric, $d(x, y) = \lVert x - y \rVert$.
terms:
  - norm
  - metric
  - inner_product
examples:
  - example: euclidean_norm_on_reals_squared
    why: >-
      It comes from the dot product, which is an inner product.
  - example: x_to_x_1_plus_x_2_on_reals_squared
    why: >-
      It fails the parallelogram law, so it does not come from any inner product.
  - example: euclidean_distance_on_reals_squared
    why: >-
      It comes from the Euclidean norm.
  - example: d_x_y_eq_1_for_x_neq_y_and_d_x_x_eq_0
    why: >-
      The discrete metric does not scale, so it does not come from a norm.
  - example: great_circle_distance_on_the_surface_of_the_earth
    why: >-
      The sphere is not a vector space, so it has no norm.
  - example: x_y_to_x_1_y_1_plus_x_2_y_2_on_reals_squared
    why: >-
      The dot product on $\reals^2$. It gives the Euclidean norm.
see_also:
  - dot_product_vs_inner_product_vs_bilinear_form
  - types_of_metric_spaces
  - types_of_difference
  - types_of_size
---
## Notes

- A norm comes from an inner product exactly when it satisfies the parallelogram law,

  $$\lVert x + y \rVert^2 + \lVert x - y \rVert^2 = 2 \lVert x \rVert^2 + 2 \lVert y \rVert^2.$$
- A metric comes from a norm only if it is translation invariant ($d(x + z, y + z) = d(x, y)$) and scales ($d(c x, c y) = \lvert c \rvert d(x, y)$).
