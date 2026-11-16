---
title: 'The rotation $f$ of $\reals^2$ by $90^{\circ}$ composed with the reflection $g$ of $\reals^2$ across the $x$-axis'
detail: |-
  The rotation and the reflection are the linear maps

  $$f(x) = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} x \quad \text{and} \quad g(x) = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix} x.$$
  
level: undergraduate
is: [function_composition]
values:
  function_composition: '$$(f \circ g)(x) = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix} x$$, which is the reflection across the line $y = x$'
why:
  function_composition: >-
    The composition $f \circ g$ is multiplication by the matrix product

    $$\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix},$$

    which swaps the two coordinates of each vector.
---
