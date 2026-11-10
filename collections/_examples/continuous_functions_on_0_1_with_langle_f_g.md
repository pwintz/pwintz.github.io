---
published: false
title: 'Continuous functions on $[0, 1]$ with $\ip{f}{g} = \int_0^1 f g \mathrm{d}x$'
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
    The continuous functions on $[0, 1]$ with $\ip{f}{g} = \int_0^1 f g \mathrm{d}x$ form an inner product space, because this formula is symmetric, linear in each argument, and positive definite.
  hilbert_space: >-
    The continuous functions on $[0, 1]$ with $\ip{f}{g} = \int_0^1 f g \mathrm{d}x$ are not complete, because continuous functions can converge in this norm to a discontinuous function, so it is not a Banach space or a Hilbert space; its completion is $L^2[0, 1]$.
---
