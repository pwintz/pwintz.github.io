---
published: false
title: 'The sequence $a_n = 1/2^n$, for $n \geq 0$: $1, \frac{1}{2}, \frac{1}{4}, \frac{1}{8}, \dots$'
level: elementary
figure:
  widget: function-plot
  params:
    var: n
    y_var: a_n
    x: [-0.5, 10.5]
    y: [-0.1, 1.15]
    curves:
      - { f: "1/2^n", from: 0, to: 10, discrete: true }
  caption: |-
    The terms $a_n = 1/2^n$, for $n$ from $0$ to $10$.
  alt: "Dots starting at height 1 and halving at each step toward 0."
is: [
  sequence,
  convergent
]
is_not: [divergent]
values:
  limit_of_sequence: '$\lim_{n \to \infty} a_n = 0$'
---
