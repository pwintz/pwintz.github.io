---
published: false
title: 'Stretching the plane, $f(x, y) = (2x, 3y)$'
level: high-school
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-0.5, 3]
    y: [-0.5, 5.6]
    shapes:
      - { polygon: [[0, 0], [0.4, 0], [0.4, 0.8], [1, 0.8], [1, 1.1], [0.4, 1.1], [0.4, 1.5], [1.2, 1.5], [1.2, 1.8], [0, 1.8]], label: F }
      - { polygon: [[0, 0], [0.4, 0], [0.4, 0.8], [1, 0.8], [1, 1.1], [0.4, 1.1], [0.4, 1.5], [1.2, 1.5], [1.2, 1.8], [0, 1.8]], map: [[2, 0], [0, 3]], color: 1, label: "f(F)" }
  caption: |-
    A shape $F$ (blue) and its image $f(F)$ under $f(x, y) = (2x, 3y)$ (orange).
  alt: "A letter-F shape and its image stretched twice as wide and three times as tall."
values:
  jacobian: 'The matrix $$Df(x, y) = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$$'
  jacobian_determinant: '$\det Df(x, y) = 2 \cdot 3 = 6$'
why:
  jacobian_determinant: >-
    A $1 \times 1$ square becomes a $2 \times 3$ rectangle, so every area is multiplied by $6$.
  jacobian: >-
    The Jacobian matrix of $f$ is diagonal, with the stretch factors $2$ and $3$.
    Its determinant, $6$, is the factor by which $f$ multiplies areas.
---
