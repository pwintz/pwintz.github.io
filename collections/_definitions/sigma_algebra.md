---
title: σ-algebra
term: σ-algebra
applies_to: sets
synonyms: [sigma-algebra, σ-field]
levels:
  undergraduate:
    text: |-
      A _σ-algebra_ is a collection of the [subsets](/definitions/subset) of a set that can be measured, such as the events whose probabilities are defined.
      If a set can be measured, then so can everything outside it, and so can every combination of countably many [measurable sets](/definitions/measurable-set).
  graduate:
    text: |-
      Consider a set $X$ and a collection $\mathcal{F}$ of [subsets](/definitions/subset) of $X$.
      The collection $\mathcal{F}$ is a _σ-algebra_ on $X$ if

      1. $X$ is in $\mathcal{F}$,
      2. the complement of every set in $\mathcal{F}$ is in $\mathcal{F}$, and
      3. the [union](/definitions/set-union) of every [sequence](/definitions/sequence) of sets in $\mathcal{F}$ is in $\mathcal{F}$.
properties:
  - |-
    A σ-algebra also contains $\emptyset$ and is closed under [countable](/definitions/countable) [intersections](/definitions/set-intersection), by De Morgan's laws.
  - |-
    The [open sets](/definitions/open-set) of a [topology](/definitions/topology) generate a σ-algebra, the _Borel σ-algebra_: the smallest σ-algebra that contains every open set.
---
In [probability](/definitions/probability), the sets in the σ-algebra are called _events_, and the "σ" refers to [countable](/definitions/countable) [unions](/definitions/set-union) (sums).
