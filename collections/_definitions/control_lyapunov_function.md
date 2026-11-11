---
published: false
title: Control Lyapunov function
term: control Lyapunov function
applies_to: control systems
synonyms: [CLF]
levels:
  graduate:
    text: |-
      Consider a control system $\dot{x} = f(x, u)$ with an [equilibrium](/dictionary/definitions/equilibrium) at the origin.
      A _control Lyapunov function_ for the system is a [continuously differentiable](/dictionary/definitions/continuously-differentiable), [positive definite](/dictionary/definitions/positive-definite-function), radially unbounded function $V$ such that for every $x \neq 0$, some input $u$ gives

      $$\nabla V(x) \cdot f(x, u) < 0.$$
properties:
  - >-
    For [control-affine](/dictionary/definitions/control-affine) systems, a control Lyapunov function yields a [feedback](/dictionary/definitions/feedback) law that makes the origin [globally asymptotically stable](/dictionary/definitions/globally-asymptotically-stable), for example through Sontag's universal formula (Artstein's theorem).
---
