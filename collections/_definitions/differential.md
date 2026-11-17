---
title: Differential
term: differential
applies_to: functions
synonyms: ["$\\diff{f}$", total derivative]
levels:
  undergraduate:
    text: |-
      Consider a [differentiable](/dictionary/definitions/differentiable) function $f$ and a point $x$ in its domain.
      The _differential_ of $f$ at $x$ is the [linear map](/dictionary/definitions/linear-map) $\diff{f}_x : v \mapsto Df(x) v$ that best approximates $f(x + v) - f(x)$ for small $v$.
      For $f : \reals^n \to \reals$,

      $$\diff{f}_x(v) = \frac{\partial f}{\partial x_1}(x) v_1 + \dots + \frac{\partial f}{\partial x_n}(x) v_n.$$
  graduate:
    context: differential geometry
    text: |-
      Consider a smooth function $f : M \to \reals$ on a [manifold](/dictionary/definitions/manifold) $M$.
      The _differential_ of $f$ is the one-form $\diff{f}$, which assigns to each point $x$ the [covector](/dictionary/definitions/covector) $\diff{f}_x$ on the [tangent space](/dictionary/definitions/tangent-space) $T_x M$.
---
