---
title: Norm vs. metric vs. inner product
kind: siblings
areas: [linear-algebra, analysis]
summary: >
  Norms, metrics, and inner products measure size, distance, and angle, and each one gives the next in a natural way.
  A [norm](/dictionary/definitions/norm) measures the lengths of vectors, a [metric](/dictionary/definitions/metric) measures distances between points, and an [inner product](/dictionary/definitions/inner-product) measures both lengths and angles.
  An inner product gives a norm, and a norm gives a metric, but not the reverse.
relation: >
  An inner product gives a norm, $\norm{x} = \sqrt{\ip{x}{x}}$, and a norm gives a metric, $d(x, y) = \norm{x - y}$.
terms:
  - norm
  - metric
  - inner_product
examples:
  - example: euclidean_norm_on_R2
  - example: x_to_x_1_plus_x_2_on_R2
  - example: euclidean_distance_on_R2
  - example: d_x_y_eq_1_for_x_neq_y_and_d_x_x_eq_0
  - example: great_circle_distance_on_the_surface_of_the_earth
  - example: x_y_to_x_1_y_1_plus_x_2_y_2_on_R2
see_also:
  - dot_product_vs_inner_product_vs_bilinear_form
  - types_of_metric_spaces
  - types_of_difference
  - types_of_size
---
## Notes

- A [norm](/dictionary/definitions/norm) comes from an [inner product](/dictionary/definitions/inner-product) exactly when it satisfies the parallelogram law,

  $$\norm{x + y}^2 + \norm{x - y}^2 = 2 \norm{x}^2 + 2 \norm{y}^2.$$
- A [metric](/dictionary/definitions/metric) comes from a norm only if it is translation invariant ($d(x + z, y + z) = d(x, y)$) and scales ($d(c x, c y) = \abs{c} d(x, y)$).
- Each structure needs a different setting.
  An inner product and a norm are defined only on a (real or complex) vector space, because their definitions add vectors and multiply them by scalars.
  A metric needs only a set: the [discrete metric](/dictionary/definitions/discrete-metric) works on any set, and the great-circle distance works on a [sphere](/dictionary/definitions/sphere), which is not a vector space.
  So every [inner product space](/dictionary/definitions/inner-product-space) is a [normed space](/dictionary/definitions/normed-space), and every normed space is a [metric space](/dictionary/definitions/metric-space), but a metric space need not have a norm or an inner product.
