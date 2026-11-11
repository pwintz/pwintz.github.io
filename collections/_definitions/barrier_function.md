---
published: false
title: Barrier function (control theory)
term: barrier function (control)
applies_to: sets and dynamical systems
synonyms: [zeroing barrier function]
levels:
  graduate:
    text: |-
      Consider a system $\dot{x} = f(x)$ and a set $C = \setdef{x \suchthat h(x) \geq 0}$ that should remain safe.
      A (zeroing) _barrier function_ for the system and $C$ is a [continuously differentiable](/dictionary/definitions/continuously-differentiable) function $h$ such that

      $$\nabla h(x) \cdot f(x) \geq -\alpha(h(x)) \quad \text{for all } x,$$

      for some extended class-$\mathcal{K}$ function $\alpha$ ([continuous](/dictionary/definitions/continuous) and strictly increasing, with $\alpha(0) = 0$).
properties:
  - >-
    If $h$ is a barrier function and solutions are unique, then $C$ is [forward invariant](/dictionary/definitions/forward-invariant).
---
[Barrier certificates](/dictionary/definitions/barrier-certificate) and barrier functions use opposite sign conventions: the safe region is $\setdef{B \leq 0}$ for a barrier certificate and $\setdef{h \geq 0}$ for a barrier function.
Older _reciprocal_ barrier functions instead tend to infinity at the [boundary](/dictionary/definitions/boundary) of $C$.
In optimization, a [barrier function](/dictionary/definitions/barrier-function-optimization) is something else.
