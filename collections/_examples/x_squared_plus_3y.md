---
published: false
title: '$f(x, y) = x^2 + 3y$'
level: undergraduate
values:
  partial_derivative: '$\frac{\partial f}{\partial x} = 2x$ and $\frac{\partial f}{\partial y} = 3$'
  gradient: '$\nabla f(x, y) = (2x, 3)$'
  jacobian: '$\begin{bmatrix} 2x & 3 \end{bmatrix}$'
  directional_derivative: '$2x$, in the direction $v = (1, 0)$'
  differential: '$(v_1, v_2) \mapsto 2x v_1 + 3 v_2$'
  lie_derivative: '$-2x^2$, along the vector field $F(x, y) = (-x, 0)$'
why:
  gradient: >-
    A vector.
  jacobian: >-
    A $1 \times 2$ matrix, the transpose of the gradient.
  directional_derivative: >-
    $\nabla f \cdot (1, 0) = 2x$.
  differential: >-
    A linear map that takes a direction and returns a rate of change.
  lie_derivative: >-
    $\nabla f \cdot F = 2x \cdot (-x) + 3 \cdot 0$. The direction varies from point to point.
---
