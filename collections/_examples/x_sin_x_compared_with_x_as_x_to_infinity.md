---
published: false
title: '$x \sin x$ compared with $x$, as $x \to \infty$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-10, 10]
    curves:
      - {"f": "x sin(x)", "label": "f"}
      - {"f": "x", "label": "g"}
  caption: |-
    The graphs of $f(x) = x \sin x$ and $g(x) = x$.
  alt: "A wave whose swings grow with distance from the origin, and a straight line through the origin."
is: [big_O]
is_not: [
  little_o,
  big_Theta,
  big_Omega,
  asymptotically_equivalent
]
why:
  asymptotically_equivalent: >-
    $x \sin x$ is not $\Omega(x)$, $\Theta(x)$, or asymptotically equivalent to $x$, because it is zero infinitely often, and it is not $o(x)$, because the ratio $\sin x$ does not tend to $0$.
  big_O: >-
    $x \sin x$ is $O(x)$, because $\abs{x \sin x} \leq \abs{x}$.
---
