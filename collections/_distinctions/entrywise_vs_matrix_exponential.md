---
published: false
title: Entrywise exponential vs. matrix exponential
kind: siblings
areas: [linear-algebra, computing]
summary: >
  A matrix can be exponentiated in two ways, and programming languages make it easy to compute the wrong one.
  The [entrywise exponential](/dictionary/definitions/entrywise-exponential) applies $x \mapsto e^x$ to each entry separately.
  The [matrix exponential](/dictionary/definitions/matrix-exponential) $e^{A} = I + A + A^2 / 2! + \cdots$ uses matrix multiplication, so each entry of $e^{A}$ depends on all of the entries of $A$, and $t \mapsto e^{t A} x_0$ solves $\dot{x} = A x$.
  The two exponentials differ even for diagonal matrices, whose zero entries become ones under the entrywise exponential.
examples_note: >-
  Each cell is the ___ of the matrix in that row.
terms:
  - entrywise_exponential
  - matrix_exponential
examples:
  - example: zero_2_by_2
  - example: diag_1_2
  - example: nilpotent_0_1_0_0
  - example: begin_bmatrix_0_minus_1_1_0_end_bmatrix
  - example: matrix_jordan_block
see_also:
  - array_vs_matrix_vs_linear_map
---
## Notes

- In MATLAB, `exp(A)` is the [entrywise exponential](/dictionary/definitions/entrywise-exponential) and `expm(A)` is the [matrix exponential](/dictionary/definitions/matrix-exponential).
  In Python, `numpy.exp(A)` is the entrywise exponential and `scipy.linalg.expm(A)` is the matrix exponential.
- The same ambiguity affects other functions of matrices, such as square roots (`sqrt` vs. `sqrtm`) and logarithms (`log` vs. `logm`).
