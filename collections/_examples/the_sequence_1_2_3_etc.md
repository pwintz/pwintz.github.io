---
title: 'The sequence $1, 2, 3, \dots$'
level: elementary
figure:
  widget: function-plot
  params:
    var: n
    y_var: a_n
    x: [0, 10.5]
    y: [-0.5, 11]
    curves:
      - { f: "n", from: 1, to: 10, discrete: true }
  caption: |-
    The terms $1, 2, 3, \dots, 10$.
  alt: "Dots rising in a straight line, one unit at each step."
is: [
  divergent,
  sequence
]
is_not: [
  bounded,
  cauchy_sequence
]
why:
  cauchy_sequence: >-
    The sequence $1, 2, 3, \dots$ is not Cauchy, because consecutive terms always differ by $1$.
  divergent: >-
    The sequence $1, 2, 3, \dots$ is divergent because it diverges to $\infty$.
  bounded: >-
    The sequence $1, 2, 3, \dots$ is not bounded.
---
