---
published: false
title: 'The vectors $$x = \begin{bmatrix} 1 \\ 2 \end{bmatrix}$$ and $$y = \begin{bmatrix} 3 \\ -1 \end{bmatrix}$$, with the weight $$W = \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$$'
level: high-school
values:
  dot_product: '$x \cdot y = 1 \cdot 3 + 2 \cdot (-1) = 1$'
  weighted_inner_product: '$$\ip{x}{y}_W = x^{\top} W y = 2 \cdot 1 \cdot 3 + 1 \cdot 2 \cdot (-1) = 4$$'
  l2_inner_product: 'None'
why:
  l2_inner_product: >-
    The vectors $(1, 2)$ and $(3, -1)$ have no $L^2$ inner product, because they are vectors, not functions.
  dot_product: >-
    The dot product of $(1, 2)$ and $(3, -1)$ adds the products of their entries, $1$.
  weighted_inner_product: >-
    The weighted inner product counts the first entries twice, because the entry $w_{11}$ of $W$ is $2$, which gives $4$.
---
