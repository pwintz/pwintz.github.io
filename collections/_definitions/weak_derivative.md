---
published: false
title: Weak derivative
term: weak derivative
applies_to: locally integrable functions
levels:
  graduate:
    text: |-
      Consider locally integrable functions $f$ and $g$ on an interval $I$, which may not be [differentiable](/dictionary/definitions/differentiable).
      The function $g$ is the _weak derivative_ of $f$ if

      $$\int_I f \varphi^{\prime} \mathrm{d}x = -\int_I g \varphi \mathrm{d}x$$

      for every [smooth](/dictionary/definitions/smooth) function $\varphi$ that vanishes outside a [compact](/dictionary/definitions/compact) [subset](/dictionary/definitions/subset) of $I$.
properties:
  - >-
    The function $\abs{x}$ has the weak derivative $\operatorname{sign}(x)$.
    The step function that jumps from $0$ to $1$ at $0$ has no weak derivative; its derivative in the sense of distributions is the Dirac delta.
  - >-
    A function on $[a, b]$ is [absolutely continuous](/dictionary/definitions/absolutely-continuous) if and only if it has an integrable weak derivative, which then equals its [ordinary derivative](/dictionary/definitions/ordinary-derivative) [almost everywhere](/dictionary/definitions/almost-everywhere).
---
