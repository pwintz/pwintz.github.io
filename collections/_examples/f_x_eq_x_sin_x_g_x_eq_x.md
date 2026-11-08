---
published: false
title: '$f(x) = x \sin x$, $g(x) = x$'
level: high-school
is: [big_O]
is_not: [little_o, big_Theta, big_Omega, asymptotically_equivalent]
why:
  asymptotically_equivalent: >-
    $x \sin x$ is not $\Omega(x)$, $\Theta(x)$, or asymptotically equivalent to $x$, because it is zero infinitely often, and it is not $o(x)$, because the ratio $\sin x$ does not tend to $0$.
  big_O: >-
    $x \sin x$ is $O(x)$, because $\abs{x \sin x} \leq \abs{x}$.
---
