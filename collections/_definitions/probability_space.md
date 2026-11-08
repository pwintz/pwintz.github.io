---
published: false
title: Probability space
term: probability space
applies_to: random experiments
levels:
  high-school:
    text: |-
      A _probability space_ is a description of a random experiment by its possible [outcomes](/definitions/outcome), the collection of [events](/definitions/event) that we can ask about, and the [probability](/definitions/probability) of each event.
  undergraduate:
    context: measure-theoretic probability
    text: |-
      A _probability space_ is a triple $(\Omega, \mathcal{F}, P)$ such that

      1. $\Omega$ is a nonempty set, called the _sample space_, whose elements are the [outcomes](/definitions/outcome),
      2. $\mathcal{F}$ is a [σ-algebra](/definitions/sigma-algebra) on $\Omega$, whose elements are the [events](/definitions/event), and
      3. $P$ is a [probability measure](/definitions/probability-measure) on $\mathcal{F}$.
properties:
  - |-
    A probability space is a measure space whose measure of the whole space is $1$:

    $$
      P(\Omega) = 1.
    $$
---
