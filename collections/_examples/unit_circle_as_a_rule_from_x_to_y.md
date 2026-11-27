---
title: 'The circle $x^2 + y^2 = 1$, as a rule taking $x$ to $y$'
level: high-school
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.6, 1.6]
    y: [-1.6, 1.6]
    shapes:
      - { circle: [0, 0, 1] }
      - { line: [[0, 0], [0, 1]], color: 1, dash: true }
      - { point: [0, 1], color: 1, label: "(0, 1)" }
      - { point: [0, -1], color: 1, label: "(0, -1)" }
  caption: |-
    The circle $x^2 + y^2 = 1$, with the line $x = 0$ (dashed) and the points $(0, 1)$ and $(0, -1)$.
  alt: "A unit circle crossed by the vertical line x = 0 at the two points (0, 1) and (0, -1)."
is: [relation]
is_not: [
  function,
  operator
]
why:
  function: >-
    The circle $x^2 + y^2 = 1$ is not a function taking $x$ to $y$, because for $x = 0$ there are two values, $y = 1$ and $y = -1$.
  relation: >-
    The circle $x^2 + y^2 = 1$ is a relation between $\reals$ and $\reals$: it relates $x$ to $y$ if $x^2 + y^2 = 1$.
  operator: >-
    The circle $x^2 + y^2 = 1$ is not an operator, because it is not a function.
---
