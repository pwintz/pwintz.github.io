---
published: false
title: '$\dot{x} = x + u$, $y = x$'
level: graduate
is_not: [
  passive,
  input_to_state_stable
]
why:
  passive: >-
    $\dot{x} = x + u$, $y = x$ is not passive, because a storage function $V$ would satisfy $V^{\prime}(x)(x + u) \leq u x$ for every $u$, which forces $V^{\prime}(x) = x$, and then the inequality reduces to $x^2 \leq 0$.
  input_to_state_stable: >-
    $\dot{x} = x + u$, $y = x$ is not input-to-state stable, because with $u = 0$ the solution $x(t) = e^{t} x(0)$ grows without bound.
---
