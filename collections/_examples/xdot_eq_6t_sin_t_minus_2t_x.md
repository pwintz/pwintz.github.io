---
published: false
title: 'The origin of $\dot{x} = (6 t \sin t - 2 t) x$'
level: graduate
is: [lyapunov_stable]
is_not: [uniformly_stable]
why:
  lyapunov_stable: >-
    The origin of $\dot{x} = (6 t \sin t - 2 t) x$ is stable, because for each initial time $t_0$, the solutions are bounded by a constant (depending on $t_0$) times $\abs{x(t_0)}$.
  uniformly_stable: >-
    The origin of $\dot{x} = (6 t \sin t - 2 t) x$ is not uniformly stable, because for an initial time $t_0 = 2 n \pi$, the solution grows by the factor $e^{(12 - 2 \pi) t_0 + 6 \pi - \pi^2}$ between $t_0$ and $t_0 + \pi$, which grows without bound as $n$ increases, so no single $\delta$ works for every $t_0$.
---
