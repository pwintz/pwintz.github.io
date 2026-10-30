---
published: false
title: Metric space vs. normed space vs. inner product space vs. Banach space vs. Hilbert space
kind: hierarchy
areas: [linear-algebra, analysis, topology]
status: draft
summary: >
  Each kind of space adds structure to the previous one. Banach and Hilbert spaces add completeness: Cauchy sequences converge.
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
      Every finite-dimensional normed space is complete.
  - example: the_sphere_with_great_circle_distance
    why: >-
      It is not a vector space.
  - example: continuous_functions_on_0_1_with_the_max_norm
    why: >-
      Complete, but the max norm fails the parallelogram law.
  - example: continuous_functions_on_0_1_with_langle_f_g
    why: >-
      Continuous functions can converge in this norm to a discontinuous function, so the space is not complete. Its completion is $L^2[0, 1]$.
  - example: polynomials_on_0_1_with_the_max_norm
    why: >-
      By the Weierstrass approximation theorem, polynomials converge uniformly to non-polynomial functions such as $e^x$.
  - example: the_space_ell_squared_of_square_summable_sequences
    why: >-
      The standard example of an infinite-dimensional Hilbert space.
see_also:
  - norm_vs_metric_vs_inner_product
  - types_of_compactness
---
