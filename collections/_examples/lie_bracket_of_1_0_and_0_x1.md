---
published: false
title: 'The Lie bracket of the vector fields $f(x) = (1, 0)$ and $g(x) = (0, x_1)$ on $\reals^2$'
level: undergraduate
values:
  lie_bracket: '$[f, g](x) = (0, 1)$'
why:
  lie_bracket: >-
    The Lie bracket of $f(x) = (1, 0)$ and $g(x) = (0, x_1)$ is $(0, 1)$, because $$\frac{\partial g}{\partial x} = \begin{bmatrix} 0 & 0 \\ 1 & 0 \end{bmatrix}$$ and $\frac{\partial f}{\partial x} = 0$, so $$[f, g](x) = \begin{bmatrix} 0 & 0 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} - 0 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$.
    Switching back and forth between the flows of $f$ and $g$ moves points in the direction $(0, 1)$, even at points on the line $x_1 = 0$, where $g$ is $0$.
---
