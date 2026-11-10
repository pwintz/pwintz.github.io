---
published: false
title: '$\dot{x} = -x + x^2$'
level: high-school
is: [
  lyapunov_stable,
  attractive,
  asymptotically_stable,
  exponentially_stable
]
is_not: [
  globally_asymptotically_stable,
  finite_time_stable
]
why:
  asymptotically_stable: >-
    The origin of $\dot{x} = -x + x^2$ is exponentially stable, and so Lyapunov stable, attractive, and asymptotically stable, because the linearization is $\dot{x} = -x$.
  globally_asymptotically_stable: >-
    The origin of $\dot{x} = -x + x^2$ is not globally asymptotically stable, because solutions starting above $x = 1$ diverge.
  finite_time_stable: >-
    The origin of $\dot{x} = -x + x^2$ is not finite-time stable, because nearby solutions converge exponentially but do not reach $0$.
---
