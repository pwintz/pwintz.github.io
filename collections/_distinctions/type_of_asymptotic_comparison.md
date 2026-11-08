---
published: false
title: Types of asymptotic comparison
kind: family
areas: [analysis, computing]
summary: >
  To compare how fast two functions grow, mathematicians and computer scientists use several notations.
  [Big O](/definitions/big-o) is an upper bound up to a constant factor, and [big Omega](/definitions/big-omega) is a lower bound.
  [Big Theta](/definitions/big-theta) is both.
  [Little o](/definitions/little-o) means "negligible in comparison," and asymptotic equivalence means "the ratio tends to $1$," which is stronger than big Theta.
terms:
  - big_O
  - big_Omega
  - big_Theta
  - little_o
  - asymptotically_equivalent
examples_note: >-
  In each row, $f$ is compared with $g$ as $x \to \infty$.
  Is $f$ ___ of $g$?
examples:
  - example: f_x_eq_x_g_x_eq_x_squared
  - example: f_x_eq_2x_squared_plus_x_g_x_eq_x_squared
  - example: f_x_eq_x_squared_plus_x_g_x_eq_x_squared
  - example: f_x_eq_x_sin_x_g_x_eq_x
see_also:
  - types_of_limits
---
## Notes

- The point at which the comparison is made matters.
  As $h \to 0$, $\sin h = h + O(h^3)$ and $h^2 = o(h)$; as $x \to \infty$, $x = o(x^2)$.
- The "$=$" in $f = O(g)$ is an abuse of notation.
  $O(g)$ is really a set of functions, and $f = O(g)$ means $f \in O(g)$.
  In particular, $O(g) = f$ is not written.
- In the Hardy–Littlewood sense used in number theory, $x \sin x = \Omega(x)$, because $\abs{x \sin x} \geq \frac{1}{2} x$ for arbitrarily large $x$.
  In Knuth's sense, used in computer science, it is not.
