---
title: Types of norms
kind: siblings
areas: [linear-algebra]
summary: >
  A [norm](/dictionary/definitions/norm) measures the size of a vector, and $\reals^n$ has several common norms that measure size in different ways.
  The [Euclidean norm](/dictionary/definitions/euclidean-norm) is the straight-line length, the [1-norm](/dictionary/definitions/one-norm) adds the sizes of the entries, and the [infinity norm](/dictionary/definitions/infinity-norm) takes the largest entry.
  Each is a norm, so each satisfies the triangle inequality, and for every vector, $\norm{x}_{\infty} \leq \norm{x}_2 \leq \norm{x}_1$.
terms:
  - euclidean_norm
  - one_norm
  - infinity_norm
examples_note: >-
  Each cell is the norm of the vector in that row.
examples:
  - example: vector_3_minus_4
  - example: vector_1_1
  - example: vector_5_0
    why: >-
      All three norms of $(5, 0)$ equal $5$, because the vector lies along an axis: the norms differ only for vectors that point between the axes.
see_also:
  - types_of_distances
  - types_of_inner_products
  - norm_vs_metric_vs_inner_product
  - types_of_sphere_balls_and_circles
---
## Notes

- The unit "[circles](/dictionary/definitions/circle)" $\setdef{x \in \reals^2 \suchthat \norm{x} = 1}$ of the three [norms](/dictionary/definitions/norm) are a circle (Euclidean), a diamond ([1-norm](/dictionary/definitions/one-norm)), and a square ([infinity norm](/dictionary/definitions/infinity-norm)).
- All three are special cases of the $p$-norm $\norm{x}_p = (\abs{x_1}^p + \dots + \abs{x_n}^p)^{1/p}$, with $p = 2$, $1$, and $\infty$.
- On $\reals^n$, all norms are equivalent: each is within a constant factor of the others, so they agree on which sequences converge.
- A norm is defined only on a vector space, such as $\reals^n$ or a space of functions, because the definition uses scaling, $\norm{c x} = \abs{c} \norm{x}$.
  On a set without vector operations, such as a [sphere](/dictionary/definitions/sphere), use a [metric](/dictionary/definitions/metric) instead.
