---
title: 'The matrix $$\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$$'
level: undergraduate
values:
  eigenvalue: '$1$ (twice)'
  singular_value: '$\varphi$ and $1 / \varphi$, where $\varphi = \frac{1 + \sqrt{5}}{2}$'
  lu_decomposition: '$L = I$, $U = A$'
  qr_decomposition: '$Q = I$, $R = A$'
  jordan_chevalley_decomposition: '$$D = I$$, $$N = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$$'
  plu_decomposition: '$P = I$, $L = I$, $U = A$'
  singular_value_decomposition: '$\Sigma = \operatorname{diag}(\varphi, 1 / \varphi)$, where $\varphi = \frac{1 + \sqrt{5}}{2}$'
  polar_decomposition: '$$Q = \frac{1}{\sqrt{5}} \begin{bmatrix} 2 & 1 \\ -1 & 2 \end{bmatrix}$$, $$S = \frac{1}{\sqrt{5}} \begin{bmatrix} 2 & 1 \\ 1 & 3 \end{bmatrix}$$'
  cholesky_decomposition: 'None, since $A$ is not symmetric'
  eigendecomposition: 'None, since $A$ is not diagonalizable'
  schur_decomposition: '$Q = I$, $T = A$'
  jordan_normal_form: '$P = I$, $J = A$'
  toeplitz_decomposition: '$$H = \begin{bmatrix} 1 & 1/2 \\ 1/2 & 1 \end{bmatrix}$$, $$K = \begin{bmatrix} 0 & 1/2 \\ -1/2 & 0 \end{bmatrix}$$'
why:
  jordan_chevalley_decomposition: >-
    The matrix $$A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$$ is a Jordan block, which is not diagonalizable, so its Jordan–Chevalley decomposition has a nonzero nilpotent part $N = A - I$.
    $I$ commutes with every matrix, so $D = I$ and $N$ commute.
  singular_value_decomposition: >-
    The singular values of $$A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$$ are the golden ratio $\varphi$ and $1 / \varphi$, the square roots of the eigenvalues $\frac{3 \pm \sqrt{5}}{2}$ of $$A^{\top} A = \begin{bmatrix} 1 & 1 \\ 1 & 2 \end{bmatrix}$$.
    Both eigenvalues of $A$ are $1$, so the singular values differ from the eigenvalues.
    # TODO: Check the singular values.
  polar_decomposition: >-
    The polar factor $S$ of $$A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$$ is the positive semidefinite square root of $$A^{\top} A = \begin{bmatrix} 1 & 1 \\ 1 & 2 \end{bmatrix}$$, and $Q = A S^{-1}$ is a rotation.
    The eigenvalues of $S$ are the singular values $\varphi$ and $1 / \varphi$ of $A$.
  eigendecomposition: >-
    The matrix $$A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$$ has no eigendecomposition, because its only eigenvalue is $1$ and its eigenvectors are the multiples of $(1, 0)$, so it does not have two independent eigenvectors.
  jordan_normal_form: >-
    The matrix $$A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$$ is already a Jordan block, so it is its own Jordan normal form.
  toeplitz_decomposition: >-
    The Toeplitz decomposition of $$A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$$ has the symmetric part $$H = \begin{bmatrix} 1 & 1/2 \\ 1/2 & 1 \end{bmatrix}$$ and the skew-symmetric part $$K = \begin{bmatrix} 0 & 1/2 \\ -1/2 & 0 \end{bmatrix}$$.
    $H$ and $K$ do not commute, because $A$ is not normal.
---
