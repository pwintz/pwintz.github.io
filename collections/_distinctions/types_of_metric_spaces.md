---
published: false
title: Metric space vs. normed space vs. inner product space vs. Banach space vs. Hilbert space
kind: hierarchy
areas: [linear-algebra, analysis, topology]
status: draft
summary: >
  Each kind of space adds structure to the previous one.
  Banach and Hilbert spaces add completeness: Cauchy sequences converge.
relation: >
  Hilbert spaces ⊂ Banach spaces ⊂ normed spaces ⊂ metric spaces, and Hilbert spaces ⊂ inner product spaces ⊂ normed spaces.
terms:
  - metric_space
  - normed_space
  - inner_product_space
  - banach_space
  - hilbert_space
examples:
  - example: reals_n_with_the_euclidean_norm
    why: >-
      $\reals^n$ with the Euclidean norm is an inner product space, and so a normed space and a metric space, because the norm comes from the dot product.
      It is complete, as is every finite-dimensional normed space, so it is a Banach space and a Hilbert space.
  - example: the_sphere_with_great_circle_distance
    why: >-
      The sphere with great-circle distance is a metric space.
      It is not a normed space, because it is not a vector space.
  - example: continuous_functions_on_0_1_with_the_max_norm
    why: >-
      The continuous functions with the max norm form a normed space, and so a metric space, and it is complete, so it is a Banach space.
      It is not an inner product space or a Hilbert space, because the max norm fails the parallelogram law.
  - example: continuous_functions_on_0_1_with_langle_f_g
    why: >-
      The continuous functions with $\langle f, g \rangle = \int_0^1 f g \mathrm{d}x$ form an inner product space, and so a normed space and a metric space.
      It is not complete, because continuous functions can converge in this norm to a discontinuous function, so it is not a Banach space or a Hilbert space; its completion is $L^2[0, 1]$.
  - example: polynomials_on_0_1_with_the_max_norm
    why: >-
      The polynomials with the max norm form a normed space, and so a metric space.
      It is not a Banach space, because, by the Weierstrass approximation theorem, polynomials converge uniformly to non-polynomial functions such as $e^x$.
  - example: the_space_ell_squared_of_square_summable_sequences
    why: >-
      $\ell^2$ is a Hilbert space, with $\langle x, y \rangle = \sum_n x_n y_n$, so it is also an inner product space, a Banach space, a normed space, and a metric space.
      It is the standard example of an infinite-dimensional Hilbert space.
see_also:
  - norm_vs_metric_vs_inner_product
  - types_of_compactness
---
