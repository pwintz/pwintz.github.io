---
published: false
title: Topology on a set
term: topology
applies_to: sets
levels:
  high-school:
    text: |-
      A _topology_ on a set is a choice of which subsets count as "open."
      It describes which points are near which, without measuring distances.
  undergraduate:
    text: |-
      Consider a set $X$ and a collection $\mathcal{T}$ of subsets of $X$, called _open sets_.
      The collection $\mathcal{T}$ is a _topology_ on $X$ if $\emptyset$ and $X$ are in $\mathcal{T}$, every union of sets in $\mathcal{T}$ is in $\mathcal{T}$, and every intersection of finitely many sets in $\mathcal{T}$ is in $\mathcal{T}$.
properties:
  - |-
    Every [metric](/definitions/metric) defines a topology, whose open sets are the unions of [open balls](/definitions/open-ball).
  - |-
    The complement of an open set need not be open.
    The complements of open sets are called _closed_.
---
"Topology" is also the name of the branch of mathematics that studies topologies and [continuous](/definitions/continuous) maps.
