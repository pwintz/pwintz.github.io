---
published: false
title: Differential
term: differential
applies_to: functions
synonyms: ["$\\mathrm{d}f$", total derivative]
levels:
  undergraduate:
    text: |-
      The _differential_ of $f$ at $x$ is the [linear map](/definitions/linear-map) $\mathrm{d}f_x : v \mapsto Df(x) v$ that best approximates $f(x + v) - f(x)$ for small $v$. For $f : \reals^n \to \reals$,

      $$\mathrm{d}f_x(v) = \frac{\partial f}{\partial x_1}(x) v_1 + \dots + \frac{\partial f}{\partial x_n}(x) v_n.$$
  graduate:
    context: differential geometry
    text: |-
      For $f : M \to \reals$, the _differential_ is the one-form $\mathrm{d}f$, which assigns to each point $x$ the [covector](/definitions/covector) $\mathrm{d}f_x$ on the [tangent space](/definitions/tangent-space) $T_x M$.
---
