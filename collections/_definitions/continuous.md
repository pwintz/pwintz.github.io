---
title: Continuous function
term: continuous
applies_to: functions
levels:
  elementary:
    text: |-
      Think of a function $y = f(x)$. 
      The graph of $f(x)$ is a plot that shows the value of $y$ for each values of $x$ by plotting the value of $x$ on a horizontal axis and the value $y = f(x)$ on the vertical axis. 
      The function is _continuous_ if you can draw its graph without lifting your pencil.
    caveat: >-
      This only works when the domain is one unbroken interval.
      The function $x \mapsto 1/x$ is continuous, but its graph comes in two pieces because $0$ is not in its domain.
  high-school:
    text: |-
      Consider a function $f$.
      The function $f$ is _continuous_ if

      $$\lim_{x \to a} f(x) = f(a)$$

      for every $a$ in the domain of $f$.
  undergraduate:
    context: metric spaces
    text: |-
      Consider a function $f : X \to Y$ between [metric spaces](/dictionary/definitions/metric-space).
      The function $f$ is _continuous_ if for every $x \in X$ and every $\varepsilon > 0$, there exists $\delta > 0$ such that

      $$d(f(x), f(y)) < \varepsilon \quad \text{for every } y \in X \text{ with } d(x, y) < \delta.$$
      
      The choice of $\delta$ may depend on both $\varepsilon$ and $x$.
  graduate:
    context: topological spaces
    text: |-
      Consider a function $f : X \to Y$ between topological spaces.
      The function $f$ is _continuous_ if the [preimage](/dictionary/definitions/preimage) $f^{-1}(V)$ is open in $X$ for every [open set](/dictionary/definitions/open-set) $V$ in $Y$.
properties:
  - >-
    Sums, products, and compositions of continuous functions are continuous.
  - >-
    Continuous images of [compact](/dictionary/definitions/compact) sets are compact, and continuous images of [connected](/dictionary/definitions/connected) sets are connected.
  - >-
    A continuous function on $[a, b]$ takes every value between $f(a)$ and $f(b)$ (the intermediate value theorem).
---
