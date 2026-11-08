---
title: Uniformly stable equilibrium
term: uniformly stable
applies_to: equilibria of time-varying systems
levels:
  graduate:
    context: time-varying systems
    text: |-
      Consider a time-varying system $\dot{x} = f(t, x)$ with an [equilibrium](/definitions/equilibrium) at $0$, and its solutions $x(t)$ starting at $x(t_0)$ at the initial time $t_0$.
      The equilibrium is _uniformly stable_ if, for every $\varepsilon > 0$, there is a $\delta > 0$, independent of $t_0$, such that

      $$\norm{x(t_0)} < \delta \implies \norm{x(t)} < \varepsilon \quad \text{for all } t \geq t_0 \text{ and every } t_0 \geq 0.$$
    caveat: >-
      For a [Lyapunov stable](/definitions/lyapunov-stable) [equilibrium](/definitions/equilibrium) of a time-varying system, $\delta$ may depend on $t_0$.
properties:
  - >-
    For a [time-invariant](/definitions/time-invariant) system, every stable [equilibrium](/definitions/equilibrium) is uniformly stable, because shifting the initial time does not change the solutions.
---
