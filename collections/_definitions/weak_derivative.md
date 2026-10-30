---
published: false
title: Weak derivative
term: weak derivative
applies_to: locally integrable functions
levels:
  graduate:
    text: |-
      A locally integrable function $g$ is the _weak derivative_ of a locally integrable function $f$ on an interval $I$ if

      $$\int_I f \varphi^{\prime} \mathrm{d}x = -\int_I g \varphi \mathrm{d}x$$

      for every [smooth](/definitions/smooth) function $\varphi$ that vanishes outside a [compact](/definitions/compact) [subset](/definitions/subset) of $I$.
properties:
  - >-
    The function $\lvert x \rvert$ has the weak derivative $\operatorname{sign}(x)$. The step function that jumps from $0$ to $1$ at $0$ has no weak derivative; its derivative in the sense of distributions is the Dirac delta.
  - >-
    A function on $[a, b]$ is [absolutely continuous](/definitions/absolutely-continuous) if and only if it has an integrable weak derivative, which then equals its [ordinary derivative](/definitions/ordinary-derivative) [almost everywhere](/definitions/almost-everywhere).
---
