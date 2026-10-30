---
published: false
title: Gâteaux derivative
term: Gâteaux derivative
applies_to: maps between normed spaces
levels:
  graduate:
    text: |-
      The _Gâteaux derivative_ of $f : X \to Y$ at $x$ in the direction $h$ is $\lim_{t \to 0} \frac{f(x + t h) - f(x)}{t}$. The map $f$ is Gâteaux [differentiable](/definitions/differentiable) at $x$ if this limit exists for every direction $h$ and is a [bounded](/definitions/bounded) linear function of $h$.
properties:
  - >-
    Gâteaux differentiability does not imply continuity. The function with $f(x, y) = \frac{x^3 y}{x^6 + y^2}$ for $(x, y) \neq 0$ and $f(0) = 0$ has Gâteaux derivative $0$ at the origin, but $f = \frac{1}{2}$ along the curve $y = x^3$.
  - >-
    If the Gâteaux derivative exists near $x$ and depends continuously on the point, then $f$ is Fréchet [differentiable](/definitions/differentiable) at $x$.
---
