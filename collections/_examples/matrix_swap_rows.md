---
published: false
title: 'The matrix $$\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$$'
level: undergraduate
values:
  lu_decomposition: 'None, without exchanging rows'
  qr_decomposition: '$Q = A$, $R = I$'
  singular_value_decomposition: '$U = A$, $\Sigma = I$, $V = I$'
  jordan_chevalley_decomposition: '$D = A$, $N = 0$'
why:
  lu_decomposition: >-
    In any product $L U$, the top-left entry $0$ would force $L$ or $U$ to be singular, but $A$ is invertible.
    Exchanging the rows gives $P A = I = I \cdot I$.
  qr_decomposition: >-
    The matrix is already orthogonal.
---
