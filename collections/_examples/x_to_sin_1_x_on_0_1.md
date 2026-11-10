---
title: '$x \mapsto \sin(1/x)$ on $(0, 1]$'
level: undergraduate
is: [
  continuous,
  continuously_differentiable,
  locally_Lipschitz_continuous
]
is_not: [
  uniformly_continuous,
  Lipschitz_continuous
]
why:
  # TODO: Add why continuous.
  continuously_differentiable: >-
    $x \mapsto \sin(1/x)$ is continuously differentiable, and so continuous, on $(0, 1]$.
  uniformly_continuous: |-
    $x \mapsto \sin(1/x)$ on $(0, 1]$ is not uniformly continuous, because points that are arbitrarily close together have values that differ by $2$.
    For each natural number $n$, let

    $$x_n = \frac{1}{\frac{\pi}{2} + 2 \pi n} \quad \text{and} \quad y_n = \frac{1}{\frac{3\pi}{2} + 2 \pi n}.$$

    Then $\sin(1/x_n) = 1$ and $\sin(1/y_n) = -1$, so $\abs{\sin(1/x_n) - \sin(1/y_n)} = 2$ for every $n$, but $\abs{x_n - y_n} \to 0$ as $n \to \infty$.
    Therefore, for $\varepsilon = 1$, no $\delta > 0$ satisfies the definition of uniform continuity: some pair $x_n, y_n$ is closer than $\delta$, but the values of the pair differ by more than $\varepsilon$.
  Lipschitz_continuous: |-
    $x \mapsto \sin(1/x)$ on $(0, 1]$ is not Lipschitz continuous, because the slopes between pairs of points on its graph are unbounded.
    With the points $x_n$ and $y_n$ from the uniform continuity explanation, the slope between $(x_n, 1)$ and $(y_n, -1)$ has absolute value

    $$\frac{2}{\abs{x_n - y_n}} = \frac{2 \left(\frac{\pi}{2} + 2 \pi n\right) \left(\frac{3\pi}{2} + 2 \pi n\right)}{\pi},$$

    which grows without bound as $n \to \infty$, so no Lipschitz constant $L$ works.
  locally_Lipschitz_continuous: >-
    $x \mapsto \sin(1/x)$ on $(0, 1]$ is locally Lipschitz continuous, because each point $x_0 \in (0, 1]$ has a neighborhood $[x_0 / 2, 1]$ on which the derivative $-\cos(1/x) / x^2$ is bounded by $4 / x_0^2$.
---
