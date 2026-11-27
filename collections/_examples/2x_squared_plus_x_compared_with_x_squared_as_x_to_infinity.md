---
published: false
title: '$2x^2 + x$ compared with $x^2$, as $x \to \infty$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-2, 2]
    curves:
      - {"f": "2x^2 + x", "label": "f"}
      - {"f": "x^2", "label": "g"}
  caption: |-
    The graphs of $f(x) = 2x^2 + x$ and $g(x) = x^2$.
  alt: "Two upward parabolas: a steeper one for f and a wider one for g."
is: [
  big_O,
  big_Theta,
  big_Omega
]
is_not: [
  little_o,
  asymptotically_equivalent
]
why:
  asymptotically_equivalent: >-
    $2x^2 + x$ is not asymptotically equivalent to $x^2$, because the ratio $(2x^2 + x) / x^2$ tends to $2$, not $1$.
  big_Theta: >-
    $2x^2 + x$ is $\Theta(x^2)$, because the ratio $(2x^2 + x) / x^2$ tends to $2$, a positive number.
  little_o: >-
    $2x^2 + x$ is not $o(x^2)$, because the ratio $(2x^2 + x) / x^2$ tends to $2$, not $0$.
  big_O: >-
    $2x^2 + x$ is $O(x^2)$, because the ratio $(2x^2 + x) / x^2$ tends to $2$, so it is bounded for large $x$.
  big_Omega: >-
    $2x^2 + x$ is $\Omega(x^2)$, because the ratio $(2x^2 + x) / x^2$ tends to $2$, so it stays above $1$ for large $x$.
---
