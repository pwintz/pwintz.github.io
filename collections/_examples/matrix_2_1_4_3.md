---
title: 'The matrix $$\begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$'
level: undergraduate
is_not: [
  orthogonal_matrix,
  symmetric_matrix,
  skew_symmetric_matrix,
  singular_matrix,
  defective_matrix
]
is: [invertible_matrix]
values:
  lu_decomposition: '$$L = \begin{bmatrix} 1 & 0 \\ 2 & 1 \end{bmatrix}$$, $$U = \begin{bmatrix} 2 & 1 \\ 0 & 1 \end{bmatrix}$$'
  jordan_chevalley_decomposition: '$D = A$, $N = 0$'
  plu_decomposition: '$P = I$, with $L$ and $U$ as in the LU decomposition'
  singular_value_decomposition: '$\Sigma = \operatorname{diag}\bigl(\sqrt{15 + \sqrt{221}}, \sqrt{15 - \sqrt{221}}\bigr) \approx \operatorname{diag}(5.46, 0.37)$'
  polar_decomposition: '$$Q = \frac{1}{\sqrt{34}} \begin{bmatrix} 5 & -3 \\ 3 & 5 \end{bmatrix}$$, $$S = \frac{1}{\sqrt{34}} \begin{bmatrix} 22 & 14 \\ 14 & 12 \end{bmatrix}$$'
  cholesky_decomposition: 'None'
  eigendecomposition: '$$P = \begin{bmatrix} 1 & 1 \\ \frac{1 + \sqrt{17}}{2} & \frac{1 - \sqrt{17}}{2} \end{bmatrix}$$, $D = \operatorname{diag}\bigl(\frac{5 + \sqrt{17}}{2}, \frac{5 - \sqrt{17}}{2}\bigr)$'
  schur_decomposition: '$$T = \begin{bmatrix} \frac{5 + \sqrt{17}}{2} & -3 \\ 0 & \frac{5 - \sqrt{17}}{2} \end{bmatrix}$$'
  jordan_normal_form: '$J = D$, as in the eigendecomposition'
  toeplitz_decomposition: '$$H = \begin{bmatrix} 2 & 5/2 \\ 5/2 & 3 \end{bmatrix}$$, $$K = \begin{bmatrix} 0 & -3/2 \\ 3/2 & 0 \end{bmatrix}$$'
  transpose: '$$A^{\top} = \begin{bmatrix} 2 & 4 \\ 1 & 3 \end{bmatrix}$$'
  determinant: '$\det A = 2 \cdot 3 - 1 \cdot 4 = 2$'
  trace: '$\operatorname{tr} A = 2 + 3 = 5$'
  invertible_matrix: '$$A^{-1} = \frac{1}{2} \begin{bmatrix} 3 & -1 \\ -4 & 2 \end{bmatrix}$$'
  minor: '$M_{11} = 3$, $M_{12} = 4$, $M_{21} = 1$, $M_{22} = 2$'
  cofactor: '$C_{11} = 3$, $C_{12} = -4$, $C_{21} = -1$, $C_{22} = 2$'
why:
  invertible_matrix: >-
    The matrix $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ is invertible, because $\det A = 2 \neq 0$; its inverse comes from the $2 \times 2$ formula.
  orthogonal_matrix: >-
    The matrix $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ is not orthogonal, because its inverse is not its transpose.
  symmetric_matrix: >-
    The matrix $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ is not symmetric, because its entries $a_{12} = 1$ and $a_{21} = 4$ differ.
  cholesky_decomposition: >-
    The matrix $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ has no Cholesky decomposition, because $A$ is not symmetric.
  lu_decomposition: >-
    Subtracting $2$ times row $1$ from row $2$ gives $U$, and $L$ records the multiplier $2$.
  jordan_chevalley_decomposition: >-
    The matrix $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ has distinct eigenvalues, so it is diagonalizable.
    Thus its Jordan–Chevalley decomposition has $D = A$ and $N = 0$.
  plu_decomposition: >-
    The matrix $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ has an LU decomposition, so $P = I$ works.
    With partial pivoting, the rows are exchanged first instead, because $4$ is larger than $2$.
  singular_value_decomposition: >-
    The singular values of $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ are the square roots of the eigenvalues $15 \pm \sqrt{221}$ of $$A^{\top} A = \begin{bmatrix} 20 & 14 \\ 14 & 10 \end{bmatrix}$$.
    Their product is $\abs{\det A} = 2$.
  polar_decomposition: >-
    The polar factor $S$ of $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ is the positive semidefinite square root of $$A^{\top} A = \begin{bmatrix} 20 & 14 \\ 14 & 10 \end{bmatrix}$$, and $Q = A S^{-1}$ is a rotation.
  eigendecomposition: >-
    The matrix $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ has the distinct eigenvalues $\lambda = \frac{5 \pm \sqrt{17}}{2}$, with eigenvectors $(1, \lambda - 2)$, so it has an eigendecomposition.
    The eigenvectors are not perpendicular, because $A$ is not symmetric.
  schur_decomposition: >-
    In the Schur decomposition of $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$, the first column of $Q$ is a unit eigenvector for $\frac{5 + \sqrt{17}}{2}$, and the second column is perpendicular to it.
    The entry $-3$ above the diagonal is nonzero because $A$ is not normal.
  toeplitz_decomposition: >-
    The Toeplitz decomposition of $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ splits $A$ into its symmetric part $H = \frac{1}{2}(A + A^{\top})$ and its skew-symmetric part $K = \frac{1}{2}(A - A^{\top})$, which average and split the off-diagonal entries $1$ and $4$.
  singular_matrix: >-
    The matrix $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ is not singular, because $\det A = 2 \neq 0$.
  defective_matrix: >-
    The matrix $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ is not defective, because its eigenvalues $(5 \pm \sqrt{17}) / 2$ are distinct.
  minor: >-
    Each minor of $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ is the single entry left after deleting one row and one column; for example, deleting row $1$ and column $2$ leaves $4$, so $M_{12} = 4$.
  cofactor: >-
    The cofactors of $$A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$$ are its minors with the signs $+$ and $-$ in a checkerboard pattern, so $C_{12} = -M_{12} = -4$ and $C_{21} = -M_{21} = -1$.
    Expanding along row $1$ gives $\det A = 2 \cdot 3 + 1 \cdot (-4) = 2$.
---
