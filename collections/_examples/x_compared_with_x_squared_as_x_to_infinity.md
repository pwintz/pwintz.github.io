---
published: false
title: '$x$ compared with $x^2$, as $x \to \infty$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-2, 2]
    curves:
      - {"f": "x", "label": "f"}
      - {"f": "x^2", "label": "g"}
  caption: |-
    The graphs of $f(x) = x$ and $g(x) = x^2$.
  alt: "A straight line through the origin and an upward parabola, which meet at (0, 0) and (1, 1)."
is: [
  big_O,
  little_o
]
is_not: [
  big_Theta,
  big_Omega,
  asymptotically_equivalent
]
why:
  asymptotically_equivalent: >-
    $x$ is not asymptotically equivalent to $x^2$, because $x / x^2 \to 0$, not $1$.
  little_o: >-
    $x$ is $o(x^2)$, because $x / x^2 \to 0$.
  big_Omega: >-
    $x$ is not $\Omega(x^2)$, because $x / x^2 \to 0$, so $x$ is not at least a fixed multiple of $x^2$.
  big_Theta: >-
    $x$ is not $\Theta(x^2)$, because it is not $\Omega(x^2)$: $x / x^2 \to 0$.
  big_O: >-
    $x$ is $O(x^2)$, because $x / x^2 \to 0$, so the ratio is bounded for large $x$.
---
