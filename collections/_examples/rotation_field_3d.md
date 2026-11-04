---
published: false
title: '$F(x, y, z) = (-y, x, 0)$'
level: undergraduate
description: >-
  A vector field that rotates about the $z$-axis.
values:
  jacobian_determinant: '$\det DF(x, y, z) = 0$'
  jacobian: 'The matrix $$DF(x, y, z) = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$'
  divergence: '$\nabla \cdot F = 0 + 0 + 0 = 0$'
  curl: '$\nabla \times F = (0, 0, 2)$'
why:
  divergence: >-
    The trace of the Jacobian.
    A rotation does not spread out.
  curl: >-
    The rotation axis is the $z$-axis.
---
