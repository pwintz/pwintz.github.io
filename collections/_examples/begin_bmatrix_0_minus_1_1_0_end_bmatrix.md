---
title: 'The matrix $$\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$'
level: high-school
values:
  eigenvalue: '$i$ and $-i$'
  singular_value: '$1$ and $1$'
  transpose: '$$A^{\top} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$$'
  determinant: '$\det A = 0 \cdot 0 - (-1) \cdot 1 = 1$'
  trace: '$\operatorname{tr} A = 0 + 0 = 0$'
  invertible_matrix: '$$A^{-1} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$$'
  entrywise_exponential: '$$\begin{bmatrix} 1 & 1/e \\ e & 1 \end{bmatrix}$$'
  matrix_exponential: '$$\begin{bmatrix} \cos 1 & -\sin 1 \\ \sin 1 & \cos 1 \end{bmatrix}$$'
is: [
  array,
  matrix,
  invertible_matrix,
  orthogonal_matrix,
  skew_symmetric_matrix
]
is_not: [
  linear_map,
  symmetric_matrix
]
why:
  orthogonal_matrix: >-
    The rotation $$A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$ is orthogonal, because its inverse, the rotation by $-90°$, is its transpose.
  skew_symmetric_matrix: >-
    The rotation $$A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$ is skew-symmetric, because $A^{\top} = -A$.
  eigenvalue: >-
    The eigenvalues of $$A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$ are $i$ and $-i$, because $$A \begin{bmatrix} 1 \\ -i \end{bmatrix} = \begin{bmatrix} i \\ 1 \end{bmatrix} = i \begin{bmatrix} 1 \\ -i \end{bmatrix}$$ and $$A \begin{bmatrix} 1 \\ i \end{bmatrix} = \begin{bmatrix} -i \\ 1 \end{bmatrix} = -i \begin{bmatrix} 1 \\ i \end{bmatrix}$$.
    $A$ rotates every nonzero real vector by $90°$, so it has no real eigenvalues.
  singular_value: >-
    The singular values of $$A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$ are $1$ and $1$, because $A^{\top} A = I$, whose eigenvalues are $1$ and $1$.
    A rotation does not change the length of any vector.
  transpose: >-
    For the rotation by $90°$, the transpose and the inverse are the same matrix, because the rotation is orthogonal.
  entrywise_exponential: >-
    The entrywise exponential of the rotation generator $$\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$ replaces each entry $a$ by $e^a$: $$\begin{bmatrix} e^0 & e^{-1} \\ e^1 & e^0 \end{bmatrix} = \begin{bmatrix} 1 & 1/e \\ e & 1 \end{bmatrix}$$, so the zeros on the diagonal become ones.
  matrix_exponential: >-
    The matrix exponential of $$J = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$ is the rotation by $1$ radian, because $J^2 = -I$, so the series splits into the series for $\cos 1$ and $\sin 1$:
    
    $$e^{J} = \left(1 - \frac{1}{2!} + \frac{1}{4!} - \cdots\right) I + \left(1 - \frac{1}{3!} + \frac{1}{5!} - \cdots\right) J = (\cos 1) I + (\sin 1) J.$$
---
