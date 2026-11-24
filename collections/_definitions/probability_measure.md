---
title: Probability Measure
term: probability measure
applies_to: σ-algebras
levels:
  high-school:
    context: experiments with finitely many outcomes
    text: |-
      Consider a random experiment whose set $\Omega$ of possible [outcomes](/dictionary/definitions/outcome) is finite.
      A _probability measure_ $P$ assigns to each [event](/dictionary/definitions/event) $A$, which is a set of outcomes, a number $P(A)$, called the [probability](/dictionary/definitions/probability) of $A$, such that

      1. $0 \leq P(A) \leq 1$ for every event $A$,
      2. $P(\Omega) = 1$, and
      3. if two events $A$ and $B$ have no outcomes in common, then $P(A \cup B) = P(A) + P(B)$.
  undergraduate:
    context: measure-theoretic probability
    text: |-
      Consider a set $\Omega$ of [outcomes](/dictionary/definitions/outcome) and a [σ-algebra](/dictionary/definitions/sigma-algebra) $\mathcal{F}$ of [events](/dictionary/definitions/event).
      A _probability measure_ on $\mathcal{F}$ is a function $P : \mathcal{F} \to [0, 1]$ such that

      1. $P(\Omega) = 1$, and
      2. $P$ is countably additive: $P\left(\bigcup_{i} A_i\right) = \sum_{i} P(A_i)$ for every sequence of [disjoint events](/dictionary/definitions/mutually-exclusive) $A_1, A_2, \dots$.
properties:
  - |-
    A probability measure is a [measure](/dictionary/definitions/lebesgue-measure) whose total mass is $1$.
---
