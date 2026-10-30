---
published: false
title: Dot product vs. inner product vs. bilinear form
kind: hierarchy
areas: [linear-algebra]
status: draft
summary: >
  The dot product is one particular inner product on $\reals^n$. An inner product is a bilinear form that is also symmetric and positive definite.
relation: >
  dot product ⊂ inner products ⊂ bilinear forms
terms:
  - dot_product
  - inner_product
  - bilinear_form
examples:
  - example: x_y_to_x_1_y_1_plus_x_2_y_2_on_reals_squared
    why: >-
      The dot product on $\reals^2$.
  - example: x_y_to_2_x_1_y_1_plus_x_2_y_2_on_reals_squared
    why: >-
      Symmetric and positive definite, but not the standard inner product.
  - example: x_y_to_x_1_y_1_minus_x_2_y_2_on_reals_squared
    why: >-
      It is not positive definite, since $(0, 1)$ pairs with itself to give $-1$.
see_also:
  - norm_vs_metric_vs_inner_product
---
## Notes

- A bilinear form $B$ is _symmetric_ if $B(x, y) = B(y, x)$, and _positive definite_ if $B(x, x) > 0$ for every $x \neq 0$.
- On a complex vector space, an inner product is conjugate symmetric and linear in only one argument (sesquilinear), so it is not a bilinear form.
