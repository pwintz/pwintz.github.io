---
published: false
title: 'Reflecting the plane, $f(x, y) = (y, x)$'
level: high-school
values:
  jacobian: 'The matrix $$Df(x, y) = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$$'
  jacobian_determinant: '$\det Df(x, y) = 0 \cdot 0 - 1 \cdot 1 = -1$'
why:
  jacobian_determinant: >-
    Areas are unchanged, but the reflection flips regions over, so the sign is negative.
    The area scale factor is the absolute value, $1$.
  jacobian: >-
    The Jacobian matrix of $f$ swaps the coordinates.
    Its determinant is $-1$ because $f$ keeps areas the same but reverses orientation.
---
