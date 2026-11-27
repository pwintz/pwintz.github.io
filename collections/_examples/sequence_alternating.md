---
published: false
title: 'The sequence $a_n = (-1)^{n + 1}$, for $n \geq 1$: $1, -1, 1, -1, \dots$'
level: high-school
figure:
  widget: function-plot
  params:
    var: n
    y_var: a_n
    x: [0, 12.5]
    y: [-1.5, 1.5]
    curves:
      - { f: "(-1)^(n + 1)", from: 1, to: 12, discrete: true }
  caption: |-
    The terms $a_n = (-1)^{n + 1}$, for $n$ from $1$ to $12$.
  alt: "Dots alternating between heights 1 and -1."
is: [
  bounded,
  divergent
]
is_not: [convergent]
values:
  limit_of_sequence: '$\lim_{n \to \infty} a_n$ does not exist'
  limsup: '$\limsup_{n \to \infty} a_n = 1$'
  liminf: '$\liminf_{n \to \infty} a_n = -1$'
why:
  limit_of_sequence: >-
    The terms keep returning to both $1$ and $-1$, so they do not approach a single number.
  bounded: >-
    The sequence $1, -1, 1, -1, \dots$ is bounded because all of its terms are between $-1$ and $1$.
  convergent: >-
    The sequence $1, -1, 1, -1, \dots$ is not convergent, because it oscillates between $1$ and $-1$.
  divergent: >-
    The sequence $1, -1, 1, -1, \dots$ is divergent because it does not converge.
  liminf: >-
    The limit inferior of $1, -1, 1, -1, \dots$ is $-1$, because the terms keep returning to $-1$ and none is smaller.
  limsup: >-
    The limit superior of $1, -1, 1, -1, \dots$ is $1$, because the terms keep returning to $1$ and none is larger.
---
