---
published: false
title: 'Continuous functions on $[0, 1]$ with $\ip{f}{g} = \int_0^1 f g \dx$'
level: graduate
is: [
  metric_space,
  normed_space,
  inner_product_space
]
is_not: [
  banach_space,
  hilbert_space
]
why:
  inner_product_space: >-
    The continuous functions on $[0, 1]$ with $\ip{f}{g} = \int_0^1 f g \dx$ form an inner product space, because this formula is symmetric, linear in each argument, and positive definite.
  hilbert_space: >-
    The continuous functions on $[0, 1]$ with $\ip{f}{g} = \int_0^1 f g \dx$ are not a Hilbert space, because they are not complete: continuous functions can converge in this norm to a discontinuous function. Their completion is $L^2[0, 1]$.
  banach_space: >-
    The continuous functions on $[0, 1]$ with the norm $\norm{f} = \sqrt{\int_0^1 f^2 \dx}$ are not a Banach space, because they are not complete: continuous functions can converge in this norm to a discontinuous function.
---
