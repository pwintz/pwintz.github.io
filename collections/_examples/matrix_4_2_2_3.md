---
published: false
title: 'The symmetric positive definite matrix $$\begin{bmatrix} 4 & 2 \\ 2 & 3 \end{bmatrix}$$'
level: undergraduate
values:
  lu_decomposition: '$$L = \begin{bmatrix} 1 & 0 \\ 1/2 & 1 \end{bmatrix}$$, $$U = \begin{bmatrix} 4 & 2 \\ 0 & 2 \end{bmatrix}$$'
  plu_decomposition: '$P = I$, with $L$ and $U$ as in the LU decomposition'
  cholesky_decomposition: '$$L = \begin{bmatrix} 2 & 0 \\ 1 & \sqrt{2} \end{bmatrix}$$'
  eigendecomposition: '$\Lambda = \operatorname{diag}\bigl(\frac{7 + \sqrt{17}}{2}, \frac{7 - \sqrt{17}}{2}\bigr)$, with $Q$ orthogonal'
  singular_value_decomposition: '$\Sigma = \Lambda$, $U = V = Q$, as in the eigendecomposition'
  polar_decomposition: '$Q = I$, $S = A$'
  schur_decomposition: '$T = \Lambda$, as in the eigendecomposition'
  jordan_normal_form: '$J = \Lambda$, as in the eigendecomposition'
  jordan_chevalley_decomposition: '$D = A$, $N = 0$'
  toeplitz_decomposition: '$H = A$, $K = 0$'
why:
  cholesky_decomposition: >-
    The matrix $$A = \begin{bmatrix} 4 & 2 \\ 2 & 3 \end{bmatrix}$$ is symmetric with positive eigenvalues $\frac{7 \pm \sqrt{17}}{2}$, so it has a Cholesky decomposition.
    Its factor $L$ is the LU factor $U$ with each row divided by the square root of its diagonal entry, transposed.
  singular_value_decomposition: >-
    The matrix $$A = \begin{bmatrix} 4 & 2 \\ 2 & 3 \end{bmatrix}$$ is symmetric positive definite, so its eigendecomposition $A = Q \Lambda Q^{\top}$ is also a singular value decomposition.
  polar_decomposition: >-
    The matrix $$A = \begin{bmatrix} 4 & 2 \\ 2 & 3 \end{bmatrix}$$ is already symmetric positive definite, so its polar decomposition is $A = I \cdot A$.
---
