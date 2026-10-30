---
published: false
title: Absolutely continuous function
term: absolutely continuous
applies_to: functions
levels:
  undergraduate:
    context: "real functions on an interval $[a, b]$"
    text: |-
      A function $f : [a, b] \to \reals$ is _absolutely continuous_ if for every $\varepsilon > 0$, there exists $\delta > 0$ such that for every finite collection of disjoint subintervals $(x_1, y_1), \dots, (x_n, y_n)$ of $[a, b]$ with total length $\sum_{k=1}^n (y_k - x_k) < \delta$, the total change of $f$ satisfies $\sum_{k=1}^n \lvert f(y_k) - f(x_k) \rvert < \varepsilon$.
  graduate:
    context: Lebesgue integration
    text: |-
      A function $f : [a, b] \to \reals$ is _absolutely continuous_ if there is a Lebesgue integrable function $g$ such that $f(x) = f(a) + \int_a^x g(t) \mathrm{d}t$ for every $x \in [a, b]$.
properties:
  - >-
    An absolutely continuous function $f$ is [differentiable](/definitions/differentiable) [almost everywhere](/definitions/almost-everywhere), and $f(x) = f(a) + \int_a^x f^{\prime}(t) \mathrm{d}t$.
  - >-
    Every absolutely continuous function is [uniformly continuous](/definitions/uniformly-continuous) and has [bounded](/definitions/bounded) variation.
---
