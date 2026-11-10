---
title: '$x \mapsto \sqrt{x}$ on $[0, 1]$'
level: undergraduate
is: [
  Holder_continuous,
  uniformly_continuous,
  absolutely_continuous,
  continuous
]
is_not: [
  locally_Lipschitz_continuous,
  Lipschitz_continuous,
  continuously_differentiable
]
why:
  Lipschitz_continuous: >-
    $x \mapsto \sqrt{x}$ is not Lipschitz continuous, because its slope is unbounded near $0$.
  absolutely_continuous: >-
    $x \mapsto \sqrt{x}$ is absolutely continuous because it is the integral of its derivative $\frac{1}{2 \sqrt{t}}$, which is integrable on $[0, 1]$.
  uniformly_continuous: >-
    $x \mapsto \sqrt{x}$ is Hölder continuous with $\alpha = \frac{1}{2}$, since $\abs{\sqrt{x} - \sqrt{y}} \leq \abs{x - y}^{1/2}$, and so it is uniformly continuous.
  continuous: >-
    $x \mapsto \sqrt{x}$ on $[0, 1]$ is absolutely continuous because it is the integral of its derivative, so it is also uniformly continuous and continuous.
  continuously_differentiable: >-
    $x \mapsto \sqrt{x}$ on $[0, 1]$ is not Lipschitz continuous or continuously differentiable on $[0, 1]$, because its slope is unbounded near $0$.
  locally_Lipschitz_continuous: >-
    $x \mapsto \sqrt{x}$ on $[0, 1]$ is not locally Lipschitz continuous, because every neighborhood of $0$ contains points $x$ where the slope $\sqrt{x} / x = 1 / \sqrt{x}$ of the line from $(0, 0)$ is arbitrarily large.
---
