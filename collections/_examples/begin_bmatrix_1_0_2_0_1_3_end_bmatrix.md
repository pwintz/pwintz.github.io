---
title: 'The matrix $$\begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & 3 \end{bmatrix}$$'
level: undergraduate
values:
  domain: '$\reals^3$'
  codomain: '$\reals^2$'
  column_space: '$\reals^2$'
  kernel: '$$\ker A = \operatorname{span} \begin{bmatrix} 2 \\ 3 \\ -1 \end{bmatrix}$$'
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
  domain: >-
    The matrix $$A = \begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & 3 \end{bmatrix}$$ has $3$ columns, so the domain of $x \mapsto A x$ is $\reals^3$.
  codomain: >-
    The matrix $$A = \begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & 3 \end{bmatrix}$$ has $2$ rows, so the codomain of $x \mapsto A x$ is $\reals^2$.
  column_space: >-
    The column space of $$A = \begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & 3 \end{bmatrix}$$ is all of $\reals^2$, because the first two columns are the standard basis vectors $(1, 0)$ and $(0, 1)$.
  kernel: >-
    The kernel of $$A = \begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & 3 \end{bmatrix}$$ is a line in $\reals^3$, because $A x = 0$ means $x_1 = -2 x_3$ and $x_2 = -3 x_3$, so every solution is a multiple of $(2, 3, -1)$.
---
