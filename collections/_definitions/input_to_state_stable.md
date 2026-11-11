---
published: false
title: Input-to-state stability
term: input-to-state stable
applies_to: systems with inputs
synonyms: [ISS]
levels:
  undergraduate:
    text: |-
      Consider a system with a state and an input, such as a [disturbance](/dictionary/definitions/disturbance).
      The system is _input-to-state stable_ if, from every initial state, its state eventually becomes as small as the size of its input allows: [bounded](/dictionary/definitions/bounded) inputs give bounded states, and inputs that converge to zero give states that converge to zero.
  graduate:
    text: |-
      Consider a system $\dot{x} = f(x, d)$ with state $x$ and input $d$.
      The system is _input-to-state stable_ (ISS) if there are a class-$\mathcal{KL}$ function $\beta$ and a class-$\mathcal{K}$ function $\gamma$ such that every solution satisfies

      $$\norm{x(t)} \leq \beta(\norm{x(0)}, t) + \gamma(\norm{d}_{\infty})$$

      for all $t \geq 0$.
properties:
  - >-
    With $d = 0$, an ISS system has a [globally asymptotically stable](/dictionary/definitions/globally-asymptotically-stable) origin.
---
