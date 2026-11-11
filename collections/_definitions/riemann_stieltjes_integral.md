---
published: false
title: Riemann–Stieltjes integral
term: Riemann–Stieltjes integral
applies_to: pairs of functions on intervals
levels:
  undergraduate:
    text: |-
      Consider functions $f$ and $g$ on $[a, b]$.
      The _Riemann–Stieltjes integral_ of $f$ with respect to $g$ is the limit of the sums in which each value of $f$ is weighted by the change in $g$, instead of the length of the subinterval:

      $$\int_a^b f(x) \mathrm{d}g(x) = \lim \sum_{k = 1}^{n} f(t_k) \bigl(g(x_k) - g(x_{k-1})\bigr),$$

      as the longest subinterval of the partition shrinks to $0$.
properties:
  - >-
    With $g(x) = x$, it is the [Riemann integral](/dictionary/definitions/riemann-integral).
    If $g$ is [continuously differentiable](/dictionary/definitions/continuously-differentiable), then $\int_a^b f \mathrm{d}g = \int_a^b f(x) g^{\prime}(x) \mathrm{d}x$.
  - >-
    If $g$ jumps by $c$ at a point $p$ where $f$ is [continuous](/dictionary/definitions/continuous), then the jump contributes $c f(p)$, so sums and integrals can be written as one integral.
    For a [random variable](/dictionary/definitions/random-variable) $X$ with [cumulative distribution function](/dictionary/definitions/cumulative-distribution-function) $F$, $\mathbb{E}[X] = \int x \mathrm{d}F(x)$, whether $X$ is discrete, continuous, or neither.
---
