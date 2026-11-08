---
title: 'The matrix $$\begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & 3 \end{bmatrix}$$'
level: undergraduate
values:
  eigenvalue: 'None'
  singular_value: '$\sqrt{14}$ and $1$'
is: [full_rank]
why:
  eigenvalue: >-
    The matrix $$A = \begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & 3 \end{bmatrix}$$ has no eigenvalues, because only square matrices have eigenvalues.
  singular_value: >-
    The singular values of $$A = \begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & 3 \end{bmatrix}$$ are $\sqrt{14}$ and $1$, the square roots of the eigenvalues of $$A A^{\top} = \begin{bmatrix} 5 & 6 \\ 6 & 10 \end{bmatrix}$$.
    That matrix has trace $15$ and determinant $50 - 36 = 14$, so its eigenvalues are the roots of $\lambda^2 - 15 \lambda + 14 = (\lambda - 14)(\lambda - 1)$.
    The $3 \times 3$ matrix $A^{\top} A$ has the same nonzero eigenvalues, plus $0$.
---
