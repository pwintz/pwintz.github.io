---
published: false
title: Dot product vs. inner product vs. bilinear form
kind: hierarchy
areas: [linear-algebra]
status: draft
summary: >
  The dot product is one particular inner product on $\reals^n$.
  An inner product is a bilinear form that is also symmetric and positive definite.
relation: >
  dot product ⊂ inner products ⊂ bilinear forms
terms:
  - dot_product
  - inner_product
  - bilinear_form
examples:
  - example: x_y_to_x_1_y_1_plus_x_2_y_2_on_reals_squared
    why: >-
      $(x, y) \mapsto x_1 y_1 + x_2 y_2$ is the dot product on $\reals^2$.
      So it is also an inner product and a bilinear form.
  - example: x_y_to_2_x_1_y_1_plus_x_2_y_2_on_reals_squared
    why: >-
      $(x, y) \mapsto 2 x_1 y_1 + x_2 y_2$ is a bilinear form, and it is an inner product because it is symmetric and positive definite.
      It is not the dot product, because of the factor $2$.
  - example: x_y_to_x_1_y_1_minus_x_2_y_2_on_reals_squared
    why: >-
      $(x, y) \mapsto x_1 y_1 - x_2 y_2$ is a bilinear form.
      It is not an inner product, because it is not positive definite: $(0, 1)$ paired with itself gives $-1$.
see_also:
  - norm_vs_metric_vs_inner_product
---
## Notes

- A bilinear form $B$ is _symmetric_ if $B(x, y) = B(y, x)$, and _positive definite_ if $B(x, x) > 0$ for every $x \neq 0$.
- On a complex vector space, an inner product is conjugate symmetric and linear in only one argument (sesquilinear), so it is not a bilinear form.
