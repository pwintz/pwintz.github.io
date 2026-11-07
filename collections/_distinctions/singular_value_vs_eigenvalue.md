---
title: Eigenvalue vs. singular value
kind: siblings
areas: [linear-algebra]
status: draft
summary: >
  An eigenvalue of a square matrix $A$ is a factor $\lambda$ by which $A$ scales a particular nonzero vector $x$, called a eigenvalue: $Ax = \lambda x$.
  A singular value of any matrix $A$ is a factor $\sigma$ by which $A$ stretches vectors along some direction, allowing it them turn.
  Singular values are real and nonnegative, but eigenvalues can be negative or complex.
# Singular values are the square roots of the eigenvalues of $A^{\top} A$.D
# An eigenvalue of a square matrix $A$ is a factor by which $A$ stretches some nonzero vector without turning it off its line.
terms:
  - eigenvalue
  - singular_value
examples_note: >-
  Each cell lists the eigenvalues or the singular values of the matrix in that row.
examples:
  - example: diag_2_minus_3
    why: >-
      The diagonal matrix with entries $2$ and $-3$ has eigenvalues $2$ and $-3$, its diagonal entries.
      Its singular values are their absolute values, $3$ and $2$, as for every symmetric matrix.
  - example: begin_bmatrix_0_minus_1_1_0_end_bmatrix
    why: >-
      The rotation by $90°$ has the eigenvalues $\pm i$, because it turns every nonzero real vector off its line.
      Its singular values are $1$ and $1$, because a rotation does not change lengths.
  - example: matrix_jordan_block
    why: >-
      The shear $$\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$$ has the eigenvalue $1$ twice, and it fixes the vector $(1, 0)$.
      Its singular values are $\varphi \approx 1.618$ and $1 / \varphi \approx 0.618$, the square roots of the eigenvalues $\frac{3 \pm \sqrt{5}}{2}$ of $A^{\top} A$, because the shear stretches some directions and shrinks others.
  - example: begin_bmatrix_1_0_2_0_1_3_end_bmatrix
    why: >-
      The $2 \times 3$ matrix has no eigenvalues, because only square matrices have them.
      Its singular values are $\sqrt{14}$ and $1$, the square roots of the eigenvalues $14$ and $1$ of $A A^{\top}$ (which are the nonzero eigenvalues of $A^{\top} A$).
see_also:
  - types_of_matrix_decompositions
---
## Notes

- For a normal matrix ($A^{\top} A = A A^{\top}$, such as a symmetric or orthogonal matrix), the singular values are the absolute values of the eigenvalues.
- For a square matrix, the product of the singular values is $\lvert \det A \rvert$, the absolute value of the product of the eigenvalues.
