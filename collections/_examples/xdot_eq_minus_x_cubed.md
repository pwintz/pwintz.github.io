---
published: false
title: '$\dot{x} = -x^3$'
level: high-school
is: [lyapunov_stable, attractive, asymptotically_stable, globally_asymptotically_stable]
is_not: [exponentially_stable, finite_time_stable]
why:
  finite_time_stable: >-
    The origin of $\dot{x} = -x^3$ is not exponentially or finite-time stable, because solutions converge like $1 / \sqrt{2t}$, slower than every exponential.
  globally_asymptotically_stable: >-
    The origin of $\dot{x} = -x^3$ is globally asymptotically stable, and so Lyapunov stable and attractive, because every solution decreases in size to $0$.
---
