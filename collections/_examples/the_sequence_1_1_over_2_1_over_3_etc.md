---
published: false
title: 'The sequence $1, \frac{1}{2}, \frac{1}{3}, \dots$'
level: elementary
figure:
  widget: function-plot
  params:
    var: n
    y_var: a_n
    x: [0, 15.5]
    y: [-0.1, 1.15]
    curves:
      - { f: "1/n", from: 1, to: 15, discrete: true }
  caption: |-
    The terms $1, 1/2, 1/3, \dots, 1/15$.
  alt: "Dots starting at height 1 and decreasing toward 0."
is: [
  bounded,
  convergent
]
why:
  convergent: >-
    The sequence $1, \frac{1}{2}, \frac{1}{3}, \dots$ is convergent because it converges to $0$.
  bounded: >-
    The sequence $1, \frac{1}{2}, \frac{1}{3}, \dots$ is bounded because all of its terms are between $0$ and $1$.
---
