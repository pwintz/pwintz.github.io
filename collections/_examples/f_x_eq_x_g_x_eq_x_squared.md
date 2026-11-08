---
published: false
title: '$f(x) = x$, $g(x) = x^2$'
level: high-school
is: [big_O, little_o]
is_not: [big_Theta, big_Omega, asymptotically_equivalent]
why:
  asymptotically_equivalent: >-
    $x$ is not $\Omega(x^2)$, $\Theta(x^2)$, or asymptotically equivalent to $x^2$, because $x / x^2 \to 0$.
  little_o: >-
    $x$ is $O(x^2)$ and $o(x^2)$, because $x / x^2 \to 0$.
---
