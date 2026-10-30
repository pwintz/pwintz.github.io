---
published: false
title: Barrier function (control theory)
term: barrier function (control)
applies_to: sets and dynamical systems
synonyms: [zeroing barrier function]
levels:
  graduate:
    text: |-
      A (zeroing) _barrier function_ for $\dot{x} = f(x)$ and the set $C = \lbrace x : h(x) \geq 0 \rbrace$ is a [continuously differentiable](/definitions/continuously-differentiable) function $h$ such that $\nabla h(x) \cdot f(x) \geq -\alpha(h(x))$ for all $x$, for some extended class-$\mathcal{K}$ function $\alpha$ ([continuous](/definitions/continuous) and strictly increasing, with $\alpha(0) = 0$).
properties:
  - >-
    If $h$ is a barrier function and solutions are unique, then $C$ is [forward invariant](/definitions/forward-invariant).
---
[Barrier certificates](/definitions/barrier-certificate) and barrier functions use opposite sign conventions: the safe region is $\lbrace B \leq 0 \rbrace$ for a barrier certificate and $\lbrace h \geq 0 \rbrace$ for a barrier function. Older _reciprocal_ barrier functions instead tend to infinity at the [boundary](/definitions/boundary) of $C$. In optimization, a [barrier function](/definitions/barrier-function-optimization) is something else.
