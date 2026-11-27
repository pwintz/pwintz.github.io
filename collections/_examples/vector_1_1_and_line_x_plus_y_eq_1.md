---
title: 'The vector $(1, 1)$ and the line $x + y = 1$ in the plane, whose direction vector is $(1, -1)$'
level: high-school
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1, 2.5]
    y: [-1, 2.5]
    shapes:
      - { line: [[0, 1], [1, -1]], label: "x + y = 1", label_at: [2, -1] }
      - { vector: [[0.5, 0.5], [1.5, 1.5]], color: 1, label: "(1, 1)" }
  caption: |-
    The line $x + y = 1$ (blue) and the vector $(1, 1)$ (orange), drawn from the point $(0.5, 0.5)$ of the line.
  alt: "A line sloping down to the right, with an arrow perpendicular to it pointing up and to the right."
is: [
  normal_vector,
  orthogonal_vectors
]
is_not: [perpendicular]
why:
  normal_vector: >-
    The vector $(1, 1)$ is a normal vector to the line $x + y = 1$, because $(1, 1)$ is the gradient of $x + y$, and the gradient is perpendicular to each level set.
  orthogonal_vectors: >-
    The vector $(1, 1)$ is orthogonal to the direction vector $(1, -1)$ of the line $x + y = 1$, because their dot product is $1 - 1 = 0$.
  perpendicular: >-
    The vector $(1, 1)$ and the line $x + y = 1$ are not called perpendicular, because "perpendicular" describes two lines or planes that intersect; the normal line through $\left(\frac{1}{2}, \frac{1}{2}\right)$ in the direction $(1, 1)$ is perpendicular to the line $x + y = 1$.
---
