---
published: false
title: '$f(x) = 2x^2 + x$, $g(x) = x^2$'
level: high-school
is: [big_O, big_Theta, big_Omega]
is_not: [little_o, asymptotically_equivalent]
why:
  asymptotically_equivalent: >-
    $2x^2 + x$ is not $o(x^2)$ or asymptotically equivalent to $x^2$, because the ratio tends to $2$, not $0$ or $1$.
  big_Theta: >-
    $2x^2 + x$ is $\Theta(x^2)$, and so $O(x^2)$ and $\Omega(x^2)$, because the ratio $(2x^2 + x) / x^2$ tends to $2$.
---
