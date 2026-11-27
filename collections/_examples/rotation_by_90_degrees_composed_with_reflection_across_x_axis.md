---
title: 'The rotation $f$ of $\reals^2$ by $90^{\circ}$ composed with the reflection $g$ of $\reals^2$ across the $x$-axis'
detail: |-
  The rotation and the reflection are the linear maps

  $$f(x) = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} x \quad \text{and} \quad g(x) = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix} x.$$
  
level: undergraduate
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-2.1, 2.1]
    y: [-2.1, 2.1]
    shapes:
      - { polygon: [[0, 0], [0.4, 0], [0.4, 0.8], [1, 0.8], [1, 1.1], [0.4, 1.1], [0.4, 1.5], [1.2, 1.5], [1.2, 1.8], [0, 1.8]], label: F }
      - { polygon: [[0, 0], [0.4, 0], [0.4, 0.8], [1, 0.8], [1, 1.1], [0.4, 1.1], [0.4, 1.5], [1.2, 1.5], [1.2, 1.8], [0, 1.8]], map: [[1, 0], [0, -1]], color: 2, label: "g(F)" }
      - { polygon: [[0, 0], [0.4, 0], [0.4, 0.8], [1, 0.8], [1, 1.1], [0.4, 1.1], [0.4, 1.5], [1.2, 1.5], [1.2, 1.8], [0, 1.8]], map: [[0, 1], [1, 0]], color: 1, label: "f(g(F))" }
  caption: |-
    A shape $F$ (blue), its reflection $g(F)$ across the $x$-axis (green), and the rotation $f(g(F))$ of $g(F)$ by $90°$ (orange).
  alt: "A letter-F shape, its mirror image below the x-axis, and that image turned a quarter turn, which is the mirror image of F across the line y = x."
is: [function_composition]
values:
  function_composition: '$$(f \circ g)(x) = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix} x$$, which is the reflection across the line $y = x$'
why:
  function_composition: |-
    The composition $f \circ g$ is multiplication by the matrix product

    $$\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix},$$

    which swaps the two coordinates of each vector.
---
