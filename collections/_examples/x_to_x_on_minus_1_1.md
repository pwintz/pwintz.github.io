---
title: '$x \mapsto \abs{x}$ on $[-1, 1]$'
level: high-school
is: [
  locally_Lipschitz_continuous,
  Lipschitz_continuous,
  Holder_continuous,
  uniformly_continuous,
  absolutely_continuous
]
is_not: [continuously_differentiable]
why:
  Lipschitz_continuous: >-
    $x \mapsto \abs{x}$ is Lipschitz continuous with constant $1$, because $\abs{\abs{x} - \abs{y}} \leq \abs{x - y}$.
  continuously_differentiable: >-
    $x \mapsto \abs{x}$ is not continuously differentiable, because it is not differentiable at $0$.
  uniformly_continuous: >-
    $x \mapsto \abs{x}$ on $[-1, 1]$ is Hölder continuous (with $\alpha = 1$) and uniformly continuous, because it is Lipschitz continuous.
  absolutely_continuous: >-
    $x \mapsto \abs{x}$ on $[-1, 1]$ is absolutely continuous, because it is Lipschitz continuous.
  locally_Lipschitz_continuous: >-
    $x \mapsto \abs{x}$ on $[-1, 1]$ is locally Lipschitz continuous, because the function is Lipschitz continuous on all of $[-1, 1]$ with constant $1$, even at the corner at $0$.
---
