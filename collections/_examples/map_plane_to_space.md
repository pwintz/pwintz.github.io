---
published: false
title: '$f(u, v) = (u, v, u^2 + v^2)$, from $\reals^2$ to $\reals^3$'
level: undergraduate
values:
  jacobian: 'The matrix $$Df(u, v) = \begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 2u & 2v \end{bmatrix}$$'
  jacobian_determinant: 'None'
why:
  jacobian_determinant: >-
    The map $f(u, v) = (u, v, u^2 + v^2)$ has no Jacobian determinant, because its Jacobian matrix $Df(u, v)$ is $3 \times 2$, not square.
    The Jacobian matrix is $3 \times 2$, not square, so it has no determinant.
    Surface area is measured with $\sqrt{\det(J^{\top} J)}$ instead.
  jacobian: >-
    The Jacobian matrix of $f$ is $3 \times 2$, because $f$ maps $\reals^2$ to $\reals^3$.
---
