---
published: false
title: '$\dot{x} = -\operatorname{sign}(x) \sqrt{\abs{x}}$'
level: undergraduate
is: [
  lyapunov_stable,
  attractive,
  asymptotically_stable,
  globally_asymptotically_stable,
  finite_time_stable
]
why:
  finite_time_stable: >-
    The origin of $\dot{x} = -\operatorname{sign}(x) \sqrt{\abs{x}}$ is finite-time stable because a solution starting at $x_0 > 0$ reaches $0$ at time $2 \sqrt{x_0}$.
  globally_asymptotically_stable: >-
    The origin of $\dot{x} = -\operatorname{sign}(x) \sqrt{\abs{x}}$ is globally asymptotically stable, because it is Lyapunov stable and every solution, from every starting point, reaches $0$ in finite time.
  lyapunov_stable: >-
    The origin of $\dot{x} = -\operatorname{sign}(x) \sqrt{\abs{x}}$ is Lyapunov stable, because $\abs{x(t)}$ never increases, so solutions that start near $0$ stay near $0$.
  attractive: >-
    The origin of $\dot{x} = -\operatorname{sign}(x) \sqrt{\abs{x}}$ is attractive, because every solution reaches $0$, at time $2 \sqrt{\abs{x_0}}$.
  asymptotically_stable: >-
    The origin of $\dot{x} = -\operatorname{sign}(x) \sqrt{\abs{x}}$ is asymptotically stable, because it is Lyapunov stable and attractive.
---
