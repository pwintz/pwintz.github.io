---
published: false
title: '$x^2 + x$ compared with $x^2$, as $x \to \infty$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-2, 2]
    curves:
      - {"f": "x^2 + x", "label": "f"}
      - {"f": "x^2", "label": "g"}
  caption: |-
    The graphs of $f(x) = x^2 + x$ and $g(x) = x^2$.
  alt: "Two upward parabolas of the same shape, one shifted from the other."
is: [
  big_O,
  big_Theta,
  big_Omega,
  asymptotically_equivalent
]
is_not: [little_o]
why:
  asymptotically_equivalent: >-
    $x^2 + x$ is asymptotically equivalent to $x^2$ because the ratio $(x^2 + x) / x^2$ tends to $1$.
    So it is $\Theta(x^2)$, $O(x^2)$, and $\Omega(x^2)$, but not $o(x^2)$.
---
