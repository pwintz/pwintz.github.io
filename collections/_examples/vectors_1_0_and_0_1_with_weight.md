---
published: false
title: 'The vectors $$x = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$ and $$y = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$, with the weight $$W = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$$'
level: undergraduate
values:
  dot_product: '$x \cdot y = 0$'
  weighted_inner_product: '$\ip{x}{y}_W = x^{\top} W y = W_{12} = 1$'
why:
  dot_product: >-
    The vectors $(1, 0)$ and $(0, 1)$ are orthogonal for the dot product, because their dot product is $0$.
  weighted_inner_product: >-
    The vectors $(1, 0)$ and $(0, 1)$ are not orthogonal for the weighted inner product with this $W$, because the off-diagonal entry $W_{12} = 1$ couples the two directions.
---
