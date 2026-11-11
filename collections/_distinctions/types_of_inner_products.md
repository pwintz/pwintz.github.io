---
published: false
title: Types of inner products
kind: siblings
areas: [linear-algebra]
summary: >
  An [inner product](/dictionary/definitions/inner-product) multiplies two vectors to give a number, which determines lengths and angles, and different inner products give different geometries.
  The [dot product](/dictionary/definitions/dot-product) is the standard inner product on $\reals^n$.
  A [weighted inner product](/dictionary/definitions/weighted-inner-product) $x^{\top} W y$ stretches some directions more than others, and the $L^2$ inner product does the same job for functions, with an integral in place of a sum.
terms:
  - dot_product
  - weighted_inner_product
  - l2_inner_product
examples_note: >-
  Each cell is the inner product of the two vectors or functions in that row.
examples:
  - example: vectors_1_2_and_3_minus_1
  - example: vectors_1_0_and_0_1_with_weight
  - example: functions_1_and_t_on_0_1
see_also:
  - dot_product_vs_inner_product_vs_bilinear_form
  - types_of_norms
  - types_of_distances
---
## Notes

- Each [inner product](/dictionary/definitions/inner-product) gives a [norm](/dictionary/definitions/norm), $\norm{x} = \sqrt{\ip{x}{x}}$, and a distance, $\norm{x - y}$.
  The [dot product](/dictionary/definitions/dot-product) gives the [Euclidean norm](/dictionary/definitions/euclidean-norm).
- For complex vectors, the standard inner product is $\ip{x}{y} = \sum_i x_i \overline{y_i}$, with a complex conjugate, so that $\ip{x}{x}$ is a nonnegative [real number](/dictionary/definitions/real-number).
- An inner product is defined only on a vector space, because the definition requires it to be linear in each argument.
  The dot product and [weighted inner products](/dictionary/definitions/weighted-inner-product) need $\reals^n$ (or coordinates for a finite-dimensional space), and the $L^2$ inner product needs functions whose squares are integrable.
