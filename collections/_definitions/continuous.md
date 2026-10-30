---
published: false
title: Continuous function
term: continuous
applies_to: functions
levels:
  elementary:
    text: |-
      A function is _continuous_ if you can draw its graph without lifting your pencil.
    caveat: >-
      This only works when the domain is one unbroken interval. The function $x \mapsto 1/x$ is continuous, but its graph comes in two pieces because $0$ is not in its domain.
  high-school:
    text: |-
      A function $f$ is _continuous_ if $\lim_{x \to a} f(x) = f(a)$ for every $a$ in the domain of $f$.
  undergraduate:
    context: metric spaces
    text: |-
      A function $f : X \to Y$ is _continuous_ if for every $x \in X$ and every $\varepsilon > 0$, there exists $\delta > 0$ such that $d(f(x), f(y)) < \varepsilon$ for every $y \in X$ with $d(x, y) < \delta$. The choice of $\delta$ may depend on both $\varepsilon$ and $x$.
  graduate:
    context: topological spaces
    text: |-
      A function $f : X \to Y$ is _continuous_ if the [preimage](/definitions/preimage) $f^{-1}(V)$ is open in $X$ for every open set $V$ in $Y$.
properties:
  - >-
    Sums, products, and compositions of continuous functions are continuous.
  - >-
    Continuous images of [compact](/definitions/compact) sets are compact, and continuous images of connected sets are connected.
  - >-
    A continuous function on $[a, b]$ takes every value between $f(a)$ and $f(b)$ (the intermediate value theorem).
---
