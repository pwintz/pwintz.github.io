---
title: Uniform convergence
term: uniform convergence
applies_to: sequences of functions
levels:
  undergraduate:
    text: |-
      Consider a function $f$ and a sequence of functions $f_n$ on a set $X$.
      The sequence $f_n$ _converges uniformly_ to $f$ if, for every $\varepsilon > 0$, there exists $N \in \nats$ such that

      $$\abs{f_n(x) - f(x)} < \varepsilon \quad \text{for all } n \geq N \text{ and all } x \in X.$$
properties:
  - >-
    If the functions $f_n$ are [continuous](/definitions/continuous) and converge uniformly to $f$, then $f$ is continuous.
    If $f_n$ converges pointwise to $f$ instead of uniformly, then $f$ need not be continuous: $f_n(x) = x^n$ on $[0, 1]$ converges pointwise to the function that is $0$ for $x < 1$ and $1$ at $x = 1$.
---

_Pointwise_ convergence only requires $f_n(x) \to f(x)$ at each $x$ separately, so $N$ may depend on $x$.