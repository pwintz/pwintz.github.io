---
published: false
title: Types of asymptotic comparison
kind: family
areas: [analysis, computing]
status: draft
summary: >
  To compare how fast two functions grow, mathematicians and computer scientists use several notations.
  Big O is an upper bound up to a constant factor, and big Omega is a lower bound.
  Big Theta is both.
  Little o means "negligible in comparison," and asymptotic equivalence means "the ratio tends to $1$," which is stronger than big Theta.
terms:
  - big_O
  - little_o
  - big_Theta
  - big_Omega
  - asymptotically_equivalent
examples_note: >-
  In each row, $f$ is compared with $g$ as $x \to \infty$.
  Is $f$ ___ of $g$?
examples:
  - example: f_x_eq_x_g_x_eq_x_squared
    why: >-
      $x$ is $O(x^2)$ and $o(x^2)$ because $x / x^2 \to 0$.
      So it is not $\Omega(x^2)$, $\Theta(x^2)$, or asymptotically equivalent to $x^2$.
  - example: f_x_eq_2x_squared_plus_x_g_x_eq_x_squared
    why: >-
      $2x^2 + x$ is $\Theta(x^2)$, and so $O(x^2)$ and $\Omega(x^2)$, because the ratio $(2x^2 + x) / x^2$ tends to $2$.
      It is not $o(x^2)$ or asymptotically equivalent to $x^2$, because the ratio tends to $2$, not $0$ or $1$.
  - example: f_x_eq_x_squared_plus_x_g_x_eq_x_squared
    why: >-
      $x^2 + x$ is asymptotically equivalent to $x^2$ because the ratio $(x^2 + x) / x^2$ tends to $1$.
      So it is $\Theta(x^2)$, $O(x^2)$, and $\Omega(x^2)$, but not $o(x^2)$.
  - example: f_x_eq_x_sin_x_g_x_eq_x
    why: >-
      $x \sin x$ is $O(x)$ because $\lvert x \sin x \rvert \leq \lvert x \rvert$.
      It is not $\Omega(x)$, $\Theta(x)$, or asymptotically equivalent to $x$, because it is zero infinitely often, and it is not $o(x)$, because the ratio $\sin x$ does not tend to $0$.
see_also:
  - types_of_limits
---
## Notes

- The point at which the comparison is made matters.
  As $h \to 0$, $\sin h = h + O(h^3)$ and $h^2 = o(h)$; as $x \to \infty$, $x = o(x^2)$.
- The "$=$" in $f = O(g)$ is an abuse of notation.
  $O(g)$ is really a set of functions, and $f = O(g)$ means $f \in O(g)$.
  In particular, $O(g) = f$ is not written.
- In the Hardy–Littlewood sense used in number theory, $x \sin x = \Omega(x)$, because $\lvert x \sin x \rvert \geq \frac{1}{2} x$ for arbitrarily large $x$.
  In Knuth's sense, used in computer science, it is not.
