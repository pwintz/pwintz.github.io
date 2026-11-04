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
      $x \mapsto \sqrt{x_1^2 + x_2^2}$ is a norm: the Euclidean norm, which comes from the dot product.
  - example: x_to_x_1_plus_x_2_on_reals_squared
    why: >-
      $x \mapsto \lvert x_1 \rvert + \lvert x_2 \rvert$ is a norm.
      It does not come from an inner product, because it fails the parallelogram law: with $x = (1, 0)$ and $y = (0, 1)$, $\lVert x + y \rVert^2 + \lVert x - y \rVert^2 = 8$, but $2 \lVert x \rVert^2 + 2 \lVert y \rVert^2 = 4$.
  - example: euclidean_distance_on_reals_squared
    why: >-
      The Euclidean distance is a metric, and it comes from the Euclidean norm, as $d(x, y) = \lVert x - y \rVert$.
  - example: d_x_y_eq_1_for_x_neq_y_and_d_x_x_eq_0
    why: >-
      The discrete metric is a metric.
      It does not come from a norm, because it does not scale: $d(2x, 0) = 1 = d(x, 0)$ for every $x \neq 0$.
  - example: great_circle_distance_on_the_surface_of_the_earth
    why: >-
      Great-circle distance is a metric on the sphere.
      It does not come from a norm, because the sphere is not a vector space.
  - example: x_y_to_x_1_y_1_plus_x_2_y_2_on_reals_squared
    why: >-
      $(x, y) \mapsto x_1 y_1 + x_2 y_2$ is an inner product: the dot product on $\reals^2$.
      It gives the Euclidean norm, as $\lVert x \rVert = \sqrt{x \cdot x}$.
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
