---
published: false
title: '$f(x) = x^2 + x$, $g(x) = x^2$'
level: high-school
is: [big_O, big_Theta, big_Omega, asymptotically_equivalent]
is_not: [little_o]
why:
  asymptotically_equivalent: >-
    $x^2 + x$ is asymptotically equivalent to $x^2$ because the ratio $(x^2 + x) / x^2$ tends to $1$.
    So it is $\Theta(x^2)$, $O(x^2)$, and $\Omega(x^2)$, but not $o(x^2)$.
---
