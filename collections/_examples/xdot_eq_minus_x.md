---
published: false
title: '$\dot{x} = -x$'
level: high-school
is: [
  autonomous_time_invariant,
  autonomous_no_input,
  time_invariant,
  unforced,
  lyapunov_stable,
  attractive,
  asymptotically_stable,
  globally_asymptotically_stable,
  exponentially_stable,
  uniformly_stable
]
is_not: [finite_time_stable]
why:
  autonomous_time_invariant: >-
    $\dot{x} = -x$ has no input, so it is autonomous in both senses.
  time_invariant: >-
    $\dot{x} = -x$ is time-invariant because its right-hand side does not depend explicitly on $t$.
  unforced: >-
    $\dot{x} = -x$ is unforced because it has no input.
  finite_time_stable: >-
    The origin of $\dot{x} = -x$ is not finite-time stable, because solutions converge but do not reach $0$.
  asymptotically_stable: >-
    The origin of $\dot{x} = -x$ is asymptotically stable, because it is Lyapunov stable and attractive: $x(t) = x(0) e^{-t}$ never grows and converges to $0$.
  uniformly_stable: >-
    The origin of $\dot{x} = -x$ is uniformly stable, because the system is time-invariant: $\abs{x(t)} \leq \abs{x(t_0)}$ for every initial time $t_0$, so $\delta = \varepsilon$ works for all $t_0$.
  exponentially_stable: >-
    The origin of $\dot{x} = -x$ is exponentially stable, because $\abs{x(t)} = \abs{x(0)} e^{-t}$.
  lyapunov_stable: >-
    The origin of $\dot{x} = -x$ is Lyapunov stable, because $\abs{x(t)} = \abs{x(0)} e^{-t} \leq \abs{x(0)}$, so $\delta = \varepsilon$ works.
  attractive: >-
    The origin of $\dot{x} = -x$ is attractive, because every solution $x(t) = x(0) e^{-t}$ converges to $0$.
  globally_asymptotically_stable: >-
    The origin of $\dot{x} = -x$ is globally asymptotically stable, because it is Lyapunov stable and every solution, from every starting point, converges to $0$.
---
