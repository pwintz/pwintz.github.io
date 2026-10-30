---
published: false
title: Control barrier function
term: control barrier function
applies_to: control systems
synonyms: [CBF]
levels:
  graduate:
    text: |-
      A _control barrier function_ for $\dot{x} = f(x) + g(x) u$ and the set $C = \lbrace x : h(x) \geq 0 \rbrace$ is a [continuously differentiable](/definitions/continuously-differentiable) function $h$ such that, for every $x$, some admissible input $u$ satisfies $\nabla h(x) \cdot (f(x) + g(x) u) \geq -\alpha(h(x))$, for some extended class-$\mathcal{K}$ function $\alpha$.
properties:
  - >-
    Any locally Lipschitz [feedback](/definitions/feedback) law whose input satisfies this inequality at every $x$ renders $C$ [forward invariant](/definitions/forward-invariant).
  - >-
    Such inputs are often computed at each state by solving a quadratic program, which can also include a [control Lyapunov function](/definitions/control-lyapunov-function) constraint.
---
