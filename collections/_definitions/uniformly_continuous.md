---
published: false
title: Uniformly continuous function
term: uniformly continuous
applies_to: functions
levels:
  high-school:
    text: |-
      Consider a [continuous](/definitions/continuous) function, and how close its inputs must be to make its outputs close.
      The function is _uniformly continuous_ if, for any desired closeness of outputs, one closeness of inputs is enough everywhere at once.
  undergraduate:
    context: metric spaces
    text: |-
      Consider a function $f : X \to Y$ between [metric spaces](/definitions/metric-space).
      The function $f$ is _uniformly continuous_ if for every $\varepsilon > 0$, there exists $\delta > 0$ such that

      $$d(f(x), f(y)) < \varepsilon \quad \text{for all } x, y \in X \text{ with } d(x, y) < \delta.$$
      The choice of $\delta$ depends only on $\varepsilon$, so the same $\delta$ works at every point.
properties:
  - >-
    Every uniformly continuous function is [continuous](/definitions/continuous).
    On a [compact](/definitions/compact) domain, every continuous function is uniformly continuous (the Heine–Cantor theorem).
  - >-
    A uniformly continuous function maps Cauchy [sequences](/definitions/sequence) to [Cauchy sequences](/definitions/cauchy-sequence).
---
