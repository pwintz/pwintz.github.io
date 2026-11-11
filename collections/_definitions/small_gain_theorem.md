---
title: Small gain theorem
term: small gain theorem
applies_to: feedback interconnections
synonyms: [small-gain theorem]
levels:
  undergraduate:
    context: linear feedback systems
    text: |-
      Consider two stable systems $H_1$ and $H_2$ connected in a feedback loop, so that the output of each system is the input of the other.
      The _small gain theorem_ says that if the loop gain is less than $1$, that is,

      $$\gamma_1 \gamma_2 < 1,$$

      where $\gamma_1$ and $\gamma_2$ are the [gains](/dictionary/definitions/finite-l2-gain) of $H_1$ and $H_2$, then the feedback loop is stable.
  graduate:
    context: nonlinear systems
    text: |-
      Consider two [input-to-state stable](/dictionary/definitions/input-to-state-stable) systems connected in feedback, whose states $x_1$ and $x_2$ satisfy ISS bounds with gain functions $\gamma_1$ and $\gamma_2$ of [class $\mathcal{K}$](/dictionary/definitions/class-k), where $x_2$ is the input of the first system and $x_1$ is the input of the second system.
      The nonlinear _small gain theorem_ says that the interconnection is [globally asymptotically stable](/dictionary/definitions/globally-asymptotically-stable) if

      $$\gamma_1\bigl(\gamma_2(r)\bigr) < r \quad \text{for every } r > 0.$$
properties:
  - >-
    The small gain theorem is conservative: the theorem uses only the size of each system's gain, not the phase, so many stable feedback loops violate its condition.
  - >-
    In a [cascade](/dictionary/definitions/cascade-control), the output of the first system feeds the second system but nothing feeds back, so no small gain condition is needed: a cascade of ISS systems is ISS.
---
