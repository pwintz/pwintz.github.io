---
published: false
title: Uniformly globally asymptotically stable equilibrium
term: uniformly globally asymptotically stable
applies_to: equilibria of time-varying systems
synonyms: [UGAS]
levels:
  graduate:
    context: time-varying systems
    text: |-
      Consider a time-varying system $\dot{x} = f(t, x)$ with an [equilibrium](/definitions/equilibrium) at $0$, and its solutions $x(t)$ starting at $x(t_0)$ at the initial time $t_0$.
      The equilibrium is _uniformly globally asymptotically stable_ if there is a [class $\mathcal{KL}$](/definitions/class-kl) function $\beta$ such that

      $$\norm{x(t)} \leq \beta\bigl(\norm{x(t_0)}, t - t_0\bigr) \quad \text{for every } x(t_0), \text{ every } t_0 \geq 0, \text{ and every } t \geq t_0.$$
properties:
  - >-
    The bound $\beta$ is the same for every initial time $t_0$ ("uniformly"), applies to every initial state ("globally"), and decreases to $0$ as $t - t_0 \to \infty$ ("asymptotically").
  - >-
    Equivalently, the [equilibrium](/definitions/equilibrium) is [uniformly stable](/definitions/uniformly-stable), its solutions are uniformly [bounded](/definitions/bounded), and every solution converges to $0$ uniformly in $t_0$ and uniformly on bounded sets of initial states.
  - >-
    For a [time-invariant](/definitions/time-invariant) system, uniform global asymptotic stability is the same as [global asymptotic stability](/definitions/globally-asymptotically-stable).
---
