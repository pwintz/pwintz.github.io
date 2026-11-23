---
published: false
title: 'Reflecting the plane, $f(x, y) = (y, x)$'
level: high-school
is: [reflection_geometry]
values:
  jacobian: 'The matrix $$Df(x, y) = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$$'
  jacobian_determinant: '$\det Df(x, y) = 0 \cdot 0 - 1 \cdot 1 = -1$'
why:
  reflection_geometry: >-
    The map $f(x, y) = (y, x)$ is the reflection across the line $y = x$, because $f$ sends each point on the line $y = x$ to itself and sends each other point to the point at the same distance on the other side of the line.
  jacobian_determinant: >-
    Areas are unchanged, but the reflection flips regions over, so the sign is negative.
    The area scale factor is the absolute value, $1$.
  jacobian: >-
    The Jacobian matrix of $f$ swaps the coordinates.
    Its determinant is $-1$ because $f$ keeps areas the same but reverses orientation.
---
