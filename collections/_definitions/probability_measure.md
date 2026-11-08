---
published: false
title: Probability measure
term: probability measure
applies_to: σ-algebras
levels:
  undergraduate:
    context: measure-theoretic probability
    text: |-
      Consider a set $\Omega$ of [outcomes](/definitions/outcome) and a [σ-algebra](/definitions/sigma-algebra) $\mathcal{F}$ of [events](/definitions/event).
      A _probability measure_ on $\mathcal{F}$ is a function $P : \mathcal{F} \to [0, 1]$ such that

      1. $P(\Omega) = 1$, and
      2. $P$ is countably additive: $P\left(\bigcup_{i} A_i\right) = \sum_{i} P(A_i)$ for every sequence of disjoint events $A_1, A_2, \dots$.
properties:
  - >-
    A probability measure is a [measure](/definitions/lebesgue-measure) whose total mass is $1$.
---
