---
title: Neighborhood Basis
term: neighborhood basis
applies_to: points of topological spaces
synonyms: [local basis, local base, neighborhood base]
published: false
levels:
  graduate:
    context: topological spaces
    text: |-
      Consider a point $x$ in a [topological space](/dictionary/definitions/topological-space) $X$.
      A _neighborhood basis_ at $x$ is a collection $\mathcal{B}$ of [neighborhoods](/dictionary/definitions/neighborhood) of $x$ such that, for every neighborhood $U$ of $x$,

      $$B \subseteq U \quad \text{for some } B \in \mathcal{B}.$$
properties:
  - |-
    The collection of all [neighborhoods](/dictionary/definitions/neighborhood) of $x$ is a neighborhood basis at $x$.
  - |-
    In a [metric space](/dictionary/definitions/metric-space), the [open balls](/dictionary/definitions/open-ball) $B(x, \varepsilon)$ for $\varepsilon > 0$ form a neighborhood basis at $x$.
  - |-
    If $\mathcal{B}$ is a [basis](/dictionary/definitions/topological-basis) for the [topology](/dictionary/definitions/topology) of $X$, then the sets in $\mathcal{B}$ that contain $x$ form a neighborhood basis at $x$.
  - |-
    A space is [first countable](/dictionary/definitions/first-countable) if it has a [countable](/dictionary/definitions/countable) neighborhood basis at each point.
---
A neighborhood basis at $x$ can be chosen to consist of [open neighborhoods](/dictionary/definitions/open-neighborhood) of $x$.
For each [neighborhood](/dictionary/definitions/neighborhood) $N$ in $\mathcal{B}$, replace $N$ by an [open set](/dictionary/definitions/open-set) $V$ such that $x \in V \subseteq N$.
