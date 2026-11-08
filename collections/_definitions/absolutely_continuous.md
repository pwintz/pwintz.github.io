---
published: false
title: Absolutely continuous function
term: absolutely continuous
applies_to: functions
levels:
  undergraduate:
    context: "real functions on an interval $[a, b]$"
    text: |-
      Consider a function $f : [a, b] \to \reals$ and finite collections of disjoint subintervals $(x_1, y_1), \dots, (x_n, y_n)$ of $[a, b]$.
      The function $f$ is _absolutely continuous_ if for every $\varepsilon > 0$, there exists $\delta > 0$ such that whenever such a collection has total length

      $$\sum_{k=1}^n (y_k - x_k) < \delta,$$

      the total change of $f$ satisfies

      $$\sum_{k=1}^n \abs{f(y_k) - f(x_k)} < \varepsilon.$$
  graduate:
    context: Lebesgue integration
    text: |-
      Consider a function $f : [a, b] \to \reals$.
      The function $f$ is _absolutely continuous_ if there is a Lebesgue integrable function $g$ such that

      $$f(x) = f(a) + \int_a^x g(t) \mathrm{d}t$$

      for every $x \in [a, b]$.
properties:
  - |-
    An absolutely continuous function $f$ is [differentiable](/definitions/differentiable) [almost everywhere](/definitions/almost-everywhere), and

    $$f(x) = f(a) + \int_a^x f^{\prime}(t) \mathrm{d}t.$$
  - >-
    Every absolutely continuous function is [uniformly continuous](/definitions/uniformly-continuous) and has [bounded](/definitions/bounded) variation.
---
