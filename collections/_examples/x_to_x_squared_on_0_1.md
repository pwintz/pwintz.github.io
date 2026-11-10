---
title: '$x \mapsto x^2$ on $[0, 1]$'
level: high-school
values:
  riemann_integral: '$\int_0^1 x^2 \mathrm{d}x = \frac{1}{3}$'
  lebesgue_integral: '$\frac{1}{3}$'
is: [
  locally_Lipschitz_continuous,
  Lipschitz_continuous,
  continuously_differentiable,
  absolutely_continuous,
  continuous,
  uniformly_continuous
]
why:
  riemann_integral: >-
    The Riemann integral of $x^2$ on $[0, 1]$ is $\frac{1}{3}$, because $\frac{x^3}{3}$ is an antiderivative.
  lebesgue_integral: >-
    The Lebesgue integral of $x^2$ on $[0, 1]$ equals its Riemann integral, as for every Riemann integrable function.
  continuously_differentiable: >-
    $x \mapsto x^2$ on $[0, 1]$ is continuously differentiable because its derivative $2x$ is continuous.
  Lipschitz_continuous: >-
    $x \mapsto x^2$ on $[0, 1]$ is Lipschitz continuous because that derivative is at most $2$ on $[0, 1]$.
  continuous: >-
    $x \mapsto x^2$ on $[0, 1]$ is continuous.
  absolutely_continuous: >-
    $x \mapsto x^2$ on $[0, 1]$ is absolutely continuous, because it is Lipschitz continuous.
  uniformly_continuous: >-
    $x \mapsto x^2$ on $[0, 1]$ is uniformly continuous because every continuous function on a compact set is uniformly continuous.
  locally_Lipschitz_continuous: >-
    $x \mapsto x^2$ on $[0, 1]$ is locally Lipschitz continuous, because the function is Lipschitz continuous on all of $[0, 1]$ with constant $2$.
---
