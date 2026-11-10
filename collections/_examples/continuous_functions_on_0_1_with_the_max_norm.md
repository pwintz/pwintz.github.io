---
title: 'Continuous functions on $[0, 1]$ with the max norm'
# TODO: Add details
level: graduate
is: [
  metric_space,
  normed_space,
  banach_space
]
is_not: [
  inner_product_space,
  hilbert_space
]
why:
  metric_space: >-
    The continuous functions on $[0, 1]$ with the max norm form a metric space with $d(f, g) = \norm{f - g}$ because every normed space is a metric space.
  inner_product_space: >-
    The continuous functions on $[0, 1]$ with the max norm are not an inner product space, because the max norm fails the parallelogram law.
  hilbert_space: >-
    The continuous functions on $[0, 1]$ with the max norm are not a Hilbert space, because max norm does not define an inner product.
  normed_space: >-
    The continuous functions on $[0, 1]$ with the max norm form a normed space, because the max norm satisfies the triangle inequality and scales correctly.
  banach_space: >-
    The continuous functions on $[0, 1]$ with the max norm form a Banach space, because a uniform limit of continuous functions is continuous, so the space is complete.
---
