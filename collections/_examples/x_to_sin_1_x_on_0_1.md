---
published: false
title: '$x \mapsto \sin(1/x)$ on $(0, 1]$'
level: undergraduate
is: [continuous, continuously_differentiable, locally_Lipschitz_continuous]
is_not: [uniformly_continuous, Lipschitz_continuous]
why:
  continuously_differentiable: >-
    $x \mapsto \sin(1/x)$ is continuously differentiable, and so continuous, on $(0, 1]$.
  uniformly_continuous: >-
    $x \mapsto \sin(1/x)$ on $(0, 1]$ is not uniformly continuous, because $(0, 1]$ is not compact, and the function oscillates faster and faster as $x \to 0$.
  Lipschitz_continuous: >-
    $x \mapsto \sin(1/x)$ on $(0, 1]$ is not Lipschitz continuous, because $(0, 1]$ is not compact, and the function oscillates faster and faster as $x \to 0$.
  locally_Lipschitz_continuous: >-
    $x \mapsto \sin(1/x)$ on $(0, 1]$ is locally Lipschitz continuous, because each point $x_0 \in (0, 1]$ has a neighborhood $[x_0 / 2, 1]$ on which the derivative $-\cos(1/x) / x^2$ is bounded by $4 / x_0^2$.
---
