---
title: 'The matrix $$A = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$$'
level: undergraduate
values:
  lu_decomposition: 'None, without exchanging rows'
  qr_decomposition: '$Q = A$, $R = I$'
  singular_value_decomposition: '$U = A$, $\Sigma = I$, $V = I$'
  jordan_chevalley_decomposition: '$D = A$, $N = 0$'
  plu_decomposition: '$P = A$, $L = I$, $U = I$'
  polar_decomposition: '$Q = A$, $S = I$'
  cholesky_decomposition: 'None'
  eigendecomposition: '$$Q = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$$, $\Lambda = \operatorname{diag}(1, -1)$'
  schur_decomposition: '$T = \Lambda$, as in the eigendecomposition'
  jordan_normal_form: '$J = \Lambda$, as in the eigendecomposition'
  toeplitz_decomposition: '$H = A$, $K = 0$'
why:
  lu_decomposition: >-
    In every product $L U$, the top-left entry $0$ would force $L$ or $U$ to be singular, but $A$ is invertible.
    Exchanging the rows gives $P A = I = I \cdot I$.
  qr_decomposition: >-
    The matrix is already orthogonal.
  plu_decomposition: >-
    The matrix $$A = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$$ has no LU decomposition, but it has the PLU decomposition $A = A \cdot I \cdot I$, because $A$ is itself the permutation matrix that exchanges the two rows.
  polar_decomposition: >-
    The matrix $$A = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$$ is orthogonal, so its polar decomposition is $A = A \cdot I$.
  cholesky_decomposition: >-
    The matrix $$A = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$$ has no Cholesky decomposition, because $A$ has the negative eigenvalue $-1$, so it is not positive definite.
    The matrix $$A = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$$ is symmetric but has no Cholesky decomposition, because its eigenvalue $-1$ is negative, so it is not positive definite.
  eigendecomposition: >-
    The matrix $$A = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$$ is symmetric, so it has an eigendecomposition with an orthogonal $Q$: it fixes $(1, 1)$ and flips $(1, -1)$.
  toeplitz_decomposition: >-
    The Toeplitz decomposition of $$A = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$$ has $H = A$ and $K = 0$, because $A$ is symmetric.
  jordan_chevalley_decomposition: >-
    $A$ is orthogonal, so its QR decomposition is $A \cdot I$, its singular value decomposition is $A \cdot I \cdot I$, and its Jordan–Chevalley decomposition has $N = 0$ because $A$ is diagonalizable.
---
