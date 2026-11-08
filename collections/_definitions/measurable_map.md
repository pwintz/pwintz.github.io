---
published: false
title: Measurable map
term: measurable map
applies_to: functions between measurable spaces
synonyms: [measurable function]
levels:
  graduate:
    context: measure theory
    text: |-
      Consider sets $X$ and $Y$ with [σ-algebras](/definitions/sigma-algebra) $\mathcal{F}$ and $\mathcal{G}$, and a function $f : X \to Y$.
      The function $f$ is _measurable_ if the [preimage](/definitions/preimage) of every [measurable set](/definitions/measurable-set) is measurable:

      $$f^{-1}(B) \in \mathcal{F} \quad \text{for every } B \in \mathcal{G}.$$
properties:
  - >-
    Every [continuous](/definitions/continuous) function between topological spaces is measurable for the Borel [σ-algebras](/definitions/sigma-algebra), because the [preimage](/definitions/preimage) of every [open set](/definitions/open-set) is open, and so Borel.
  - >-
    A [random variable](/definitions/random-variable) is a measurable function from a probability space to $\reals$, so that $P(X \leq x)$ is defined for every $x$.
  - >-
    The indicator function of a set $A$ is measurable if and only if $A$ is measurable.
---
Measurability parallels continuity: a [continuous](/definitions/continuous) map pulls [open sets](/definitions/open-set) back to open sets, and a measurable map pulls [measurable sets](/definitions/measurable-set) back to measurable sets.
