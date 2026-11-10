---
title: 'Polynomials on $[0, 1]$ with the max norm'
level: graduate
is: [
  metric_space,
  normed_space
]
is_not: [banach_space]
why:
  metric_space: >-
    The polynomials on $[0, 1]$ with the max norm form a metric space, because every normed space is a metric space, with $d(p, q) = \norm{p - q}$.
  banach_space: >-
    The polynomials on $[0, 1]$ with the max norm are not a Banach space, because, by the Weierstrass approximation theorem, polynomials converge uniformly to non-polynomial functions such as $e^x$.
  normed_space: >-
    The polynomials on $[0, 1]$ with the max norm form a normed space, because the max norm satisfies the triangle inequality and scales correctly.
---
