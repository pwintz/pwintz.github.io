---
published: false
title: Control barrier function
term: control barrier function
applies_to: control systems
synonyms: [CBF]
levels:
  graduate:
    text: |-
      Consider a control system $\dot{x} = f(x) + g(x) u$ and a set $C = \setdef{x \suchthat h(x) \geq 0}$ that should remain safe.
      A _control barrier function_ for the system and $C$ is a [continuously differentiable](/dictionary/definitions/continuously-differentiable) function $h$ such that, for every $x$, some admissible input $u$ satisfies

      $$\nabla h(x) \cdot (f(x) + g(x) u) \geq -\alpha(h(x)),$$

      for some extended class-$\mathcal{K}$ function $\alpha$.
properties:
  - >-
    Every locally Lipschitz [feedback](/dictionary/definitions/feedback) law whose input satisfies this inequality at every $x$ renders $C$ [forward invariant](/dictionary/definitions/forward-invariant).
  - >-
    Such inputs are often computed at each state by solving a quadratic program, which can also include a [control Lyapunov function](/dictionary/definitions/control-lyapunov-function) constraint.
---
