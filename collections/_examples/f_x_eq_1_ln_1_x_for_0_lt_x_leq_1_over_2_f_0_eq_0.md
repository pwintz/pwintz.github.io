---
published: false
title: '$f(x) = 1 / \ln(1/x)$ for $0 < x \leq \frac{1}{2}$, $f(0) = 0$'
level: undergraduate
is: [uniformly_continuous]
is_not: [
  Holder_continuous,
  Lipschitz_continuous
]
why:
  Lipschitz_continuous: >-
    $f(x) = 1 / \ln(1/x)$ for $0 < x \leq \frac{1}{2}$, $f(0) = 0$, is not Hölder continuous for any $\alpha > 0$ (and so not Lipschitz continuous), because $f(x) / x^{\alpha} \to \infty$ as $x \to 0$.
  uniformly_continuous: >-
    The function $f(x) = 1 / \ln(1/x)$ is uniformly continuous because it is continuous on the compact interval $[0, \frac{1}{2}]$.
---
