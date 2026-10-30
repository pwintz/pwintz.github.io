---
published: false
title: Input-to-state stability
term: input-to-state stable
applies_to: systems with inputs
synonyms: [ISS]
levels:
  undergraduate:
    text: |-
      A system is _input-to-state stable_ if, from any initial state, its state eventually becomes as small as the size of its input allows: [bounded](/definitions/bounded) inputs give bounded states, and inputs that converge to zero give states that converge to zero.
  graduate:
    text: |-
      A system $\dot{x} = f(x, d)$ is _input-to-state stable_ (ISS) if there are a class-$\mathcal{KL}$ function $\beta$ and a class-$\mathcal{K}$ function $\gamma$ such that every solution satisfies

      $$\lvert x(t) \rvert \leq \beta(\lvert x(0) \rvert, t) + \gamma(\lVert d \rVert_{\infty})$$

      for all $t \geq 0$.
properties:
  - >-
    With $d = 0$, an ISS system has a [globally asymptotically stable](/definitions/globally-asymptotically-stable) origin.
---
