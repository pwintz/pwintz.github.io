---
title: '$\dot{x} = -x^3$'
level: high-school
is: [
  lyapunov_stable,
  attractive,
  asymptotically_stable,
  globally_asymptotically_stable
]
is_not: [
  exponentially_stable,
  finite_time_stable
]
why:
  finite_time_stable: >-
    The origin of $\dot{x} = -x^3$ is not finite-time stable, because solutions converge like $1 / \sqrt{2t}$ and never reach $0$.
  globally_asymptotically_stable: >-
    The origin of $\dot{x} = -x^3$ is globally asymptotically stable, because every solution, from every starting point, decreases in size to $0$.
  exponentially_stable: >-
    The origin of $\dot{x} = -x^3$ is not exponentially stable, because solutions converge like $1 / \sqrt{2t}$, slower than every exponential.
  lyapunov_stable: >-
    The origin of $\dot{x} = -x^3$ is Lyapunov stable, because $\abs{x(t)}$ never increases, so solutions that start near $0$ stay near $0$.
  attractive: >-
    The origin of $\dot{x} = -x^3$ is attractive, because every solution converges to $0$.
  asymptotically_stable: >-
    The origin of $\dot{x} = -x^3$ is asymptotically stable, because it is Lyapunov stable and attractive.
---
