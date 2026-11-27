---
published: false
title: 'The sequence $a_n = 1/n$'
level: high-school
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
    The terms $a_n = 1/n$, for $n$ from $1$ to $15$.
  alt: "Dots starting at height 1 and decreasing toward 0."
is: [
  convergent,
  cauchy_sequence
]
values:
  limit_of_sequence: '$\lim_{n \to \infty} a_n = 0$'
  limsup: '$\limsup_{n \to \infty} a_n = 0$'
  liminf: '$\liminf_{n \to \infty} a_n = 0$'
why:
  limsup: >-
    When the limit exists, it equals the limit superior and the limit inferior.
  limit_of_sequence: >-
    The sequence $1/n$ converges to $0$, because $1/n < \varepsilon$ for all $n > 1/\varepsilon$.
---
