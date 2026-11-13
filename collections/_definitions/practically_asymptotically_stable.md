---
published: false
title: Practically asymptotically stable
term: practically asymptotically stable
applies_to: equilibria of systems with a tuning parameter
synonyms: [semiglobally practically asymptotically stable, SPAS, practical stability]
levels:
  graduate:
    context: systems with a tuning parameter
    text: |-
      Consider a family of systems $\dot{x} = f_\varepsilon(x)$ that depends on a parameter $\varepsilon > 0$, such as a sampling period or a [perturbation](/dictionary/definitions/perturbation) size, and a [class $\mathcal{KL}$](/dictionary/definitions/class-kl) function $\beta$.
      The origin is _semiglobally practically asymptotically stable_ (as $\varepsilon \to 0$) if, for every radius $R > 0$ and every tolerance $\nu > 0$, there is an $\varepsilon^{\ast} > 0$ such that, for every $\varepsilon \in (0, \varepsilon^{\ast})$, every solution with $\norm{x(0)} \leq R$ satisfies

      $$\norm{x(t)} \leq \beta\bigl(\norm{x(0)}, t\bigr) + \nu \quad \text{for every } t \geq 0.$$
properties:
  - >-
    "Practically" means that solutions converge to a [ball](/dictionary/definitions/ball) of radius $\nu$ around the origin, not to the origin itself; the radius $\nu$ can be made as small as desired by making $\varepsilon$ small enough.
  - >-
    "Semiglobally" means that every [bounded](/dictionary/definitions/bounded) set of initial states can be handled, but the parameter $\varepsilon^{\ast}$ may have to shrink as the set grows.
  - >-
    Practical stability is the typical guarantee for sampled-data control, averaging, and singular [perturbations](/dictionary/definitions/perturbation), where the nominal system is [globally asymptotically stable](/dictionary/definitions/globally-asymptotically-stable) but the implemented system only approximates it.
---
