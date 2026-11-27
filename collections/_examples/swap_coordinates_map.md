---
title: 'Reflecting the plane, $f(x, y) = (y, x)$'
level: high-school
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-0.4, 2.1]
    y: [-0.4, 2.1]
    shapes:
      - { polygon: [[0, 0], [0.4, 0], [0.4, 0.8], [1, 0.8], [1, 1.1], [0.4, 1.1], [0.4, 1.5], [1.2, 1.5], [1.2, 1.8], [0, 1.8]], label: F }
      - { polygon: [[0, 0], [0.4, 0], [0.4, 0.8], [1, 0.8], [1, 1.1], [0.4, 1.1], [0.4, 1.5], [1.2, 1.5], [1.2, 1.8], [0, 1.8]], map: [[0, 1], [1, 0]], color: 1, label: "f(F)" }
  caption: |-
    A shape $F$ (blue) and its image $f(F)$ under $f(x, y) = (y, x)$ (orange).
  alt: "A letter-F shape and its mirror image across the line y = x."
is: [reflection_geometry]
is_not: [reflection_wave]
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
