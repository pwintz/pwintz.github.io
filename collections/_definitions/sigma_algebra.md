---
published: false
title: σ-algebra
term: σ-algebra
applies_to: sets
synonyms: [sigma-algebra, σ-field]
levels:
  high-school:
    text: |-
      A _σ-algebra_ is a collection of the subsets of a set that can be measured, such as the events whose probabilities are defined.
      If a set can be measured, so can everything outside it, and so can any combination of countably many measurable sets.
  undergraduate:
    text: |-
      Consider a set $X$ and a collection $\mathcal{F}$ of subsets of $X$.
      The collection $\mathcal{F}$ is a _σ-algebra_ on $X$ if $X$ is in $\mathcal{F}$, the complement of every set in $\mathcal{F}$ is in $\mathcal{F}$, and the union of every [sequence](/definitions/sequence) of sets in $\mathcal{F}$ is in $\mathcal{F}$.
properties:
  - |-
    A σ-algebra also contains $\emptyset$ and is closed under countable intersections, by De Morgan's laws.
  - |-
    The open sets of a [topology](/definitions/topology) generate a σ-algebra, the _Borel σ-algebra_: the smallest σ-algebra that contains every open set.
---
In probability, the sets in the σ-algebra are called _events_, and the "σ" refers to countable unions (sums).
