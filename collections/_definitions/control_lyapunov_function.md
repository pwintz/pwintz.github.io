---
published: false
title: Control Lyapunov function
term: control Lyapunov function
applies_to: control systems
synonyms: [CLF]
levels:
  graduate:
    text: |-
      A _control Lyapunov function_ for $\dot{x} = f(x, u)$ is a [continuously differentiable](/definitions/continuously-differentiable), [positive definite](/definitions/positive-definite-function), radially unbounded function $V$ such that for every $x \neq 0$, some input $u$ gives $\nabla V(x) \cdot f(x, u) < 0$.
properties:
  - >-
    For [control-affine](/definitions/control-affine) systems, a control Lyapunov function yields a [feedback](/definitions/feedback) law that makes the origin [globally asymptotically stable](/definitions/globally-asymptotically-stable), for example through Sontag's universal formula (Artstein's theorem).
---
