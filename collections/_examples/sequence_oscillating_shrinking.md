---
published: false
title: 'The sequence $a_n = (-1)^n (1 + 1/n)$, for $n \geq 1$: $-2, \frac{3}{2}, -\frac{4}{3}, \frac{5}{4}, \dots$'
level: undergraduate
figure:
  widget: function-plot
  params:
    var: n
    y_var: a_n
    x: [0, 15.5]
    y: [-2.3, 1.8]
    curves:
      - { f: "(-1)^n (1 + 1/n)", from: 1, to: 15, discrete: true }
      - { f: "1", dash: true, color: 1 }
      - { f: "-1", dash: true, same: true }
  caption: |-
    The terms $a_n = (-1)^n (1 + 1/n)$, for $n$ from $1$ to $15$, with the lines $y = 1$ and $y = -1$ (dashed).
  alt: "Dots alternating above 1 and below -1, getting closer to 1 and -1."
values:
  minimum: '$\min_n a_n = a_1 = -2$'
  maximum: '$\max_n a_n = a_2 = \frac{3}{2}$'
  infimum: '$\inf_n a_n = -2$'
  supremum: '$\sup_n a_n = \frac{3}{2}$'
  liminf: '$\liminf_{n \to \infty} a_n = -1$'
  limsup: '$\limsup_{n \to \infty} a_n = 1$'
  limit_of_sequence: '$\lim_{n \to \infty} a_n$ does not exist'
why:
  maximum: >-
    The largest term is the second one.
  limsup: >-
    The even terms decrease toward $1$.
    Early terms affect the supremum, but not the limit superior.
  liminf: >-
    The odd terms increase toward $-1$.
  minimum: >-
    The minimum and maximum of the terms, $-2$ and $\frac{3}{2}$, come from the first two terms, $a_1$ and $a_2$.
---
