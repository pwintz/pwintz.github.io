---
title: Topology on a set
term: topology
applies_to: sets
levels:
  high-school:
    text: |-
      A _topology_ on a set is a choice of which [subsets](/dictionary/definitions/subset) count as "open."
      It describes which points are near which, without requiring a definition of "distance".
  undergraduate:
    text: |-
      Consider a set $X$ and a collection $\mathcal{T}$ of [subsets](/dictionary/definitions/subset) of $X$.
      The collection $\mathcal{T}$ is a _topology_ on $X$ if

      1. $\emptyset$ and $X$ are in $\mathcal{T}$,
      2. every [union](/dictionary/definitions/set-union) of sets in $\mathcal{T}$ is in $\mathcal{T}$, and
      3. every [intersection](/dictionary/definitions/set-intersection) of finitely many sets in $\mathcal{T}$ is in $\mathcal{T}$.

      Each set in a topology is defined as an [open set](/dictionary/definitions/open-set).
properties:
  - |-
    Every [metric](/dictionary/definitions/metric) defines a topology, whose [open sets](/dictionary/definitions/open-set) are the [unions](/dictionary/definitions/set-union) of [open balls](/dictionary/definitions/open-ball).
  - |-
    The complement of an open set need not be open.
    The complements of [open sets](/dictionary/definitions/open-set) are called _closed_.
---
"Topology" is also the name of the branch of mathematics that studies topologies and [continuous](/dictionary/definitions/continuous) maps.
