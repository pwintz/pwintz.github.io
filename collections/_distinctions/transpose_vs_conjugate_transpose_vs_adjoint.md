---
published: false
title: Transpose vs. conjugate transpose vs. adjoint
kind: siblings
areas: [linear-algebra]
summary: >
  The transpose and the conjugate transpose of a matrix and the adjoint of a linear map are closely related: for a real matrix $A$ and the [dot product](/dictionary/definitions/dot-product), the adjoint of the linear map $x \mapsto A x$ is the linear map $y \mapsto A^{\top} y$, and the conjugate transpose of $A$ is $A^{\top}$.
  The [transpose](/dictionary/definitions/transpose) $A^{\top}$ of a matrix swaps its rows and columns.
  The [conjugate transpose](/dictionary/definitions/conjugate-transpose) $A^{\ast}$ also replaces each entry by its complex conjugate, so the conjugate transpose differs from the transpose only for matrices with non-real entries.
  The [adjoint](/dictionary/definitions/adjoint) $T^{\ast}$ of a [linear map](/dictionary/definitions/linear-map) is defined by [inner products](/dictionary/definitions/inner-product), $\ip{T v}{w} = \ip{v}{T^{\ast} w}$, so the adjoint depends on the inner products and also applies to maps without matrices, such as differential [operators](/dictionary/definitions/operator).
terms:
  - transpose
  - conjugate_transpose
  - adjoint
examples_note: >-
  Each cell is the ___ of the matrix $A$ or of the linear map $T$ in that row.
examples:
  - example: matrix_1_2_3_4_with_dot_product
  - example: matrix_1_i_0_2_complex
  - example: matrix_1_2_3_4_with_weighted_inner_product
    why: >-
      With the inner product $\ip{x}{y} = x_1 y_1 + 2 x_2 y_2$, the matrix of the adjoint of $T(x) = A x$ is not the transpose of $$A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$, because the adjoint depends on the inner product and the transpose does not.
  - example: derivative_on_functions_vanishing_at_endpoints
    why: >-
      The derivative on functions is not given by a matrix, so the derivative has no transpose or conjugate transpose in the matrix sense, but the derivative has an adjoint, because the adjoint needs only inner products.
see_also:
  - matrix_transpose_vs_inverse
  - dot_product_vs_inner_product_vs_bilinear_form
---
## Notes

- "Adjoint" also names the _adjugate_ (classical adjoint) of a square matrix, the transpose of its matrix of cofactors, which is unrelated to the adjoint here.
- Relative to [orthonormal](/dictionary/definitions/orthonormal) bases, the matrix of the adjoint is the [conjugate transpose](/dictionary/definitions/conjugate-transpose) of the matrix of the map.
  This is why the adjoint and the conjugate transpose are often treated as the same thing.
