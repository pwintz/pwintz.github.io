---
published: false
title: Subspace Topology
term: subspace topology
applies_to: subsets of topological spaces
synonyms: [relative topology, induced topology]
levels:
  undergraduate:
    context: topological spaces
    text: |-
      Consider a set $X$ with a [topology](/dictionary/definitions/topology) $\mathcal{T}$ and a [subset](/dictionary/definitions/subset) $A$ of $X$.
      The _subspace topology_ on $A$ is the collection

      $$\mathcal{T}_A = \setdef{U \cap A : U \in \mathcal{T}}.$$

      A set in $\mathcal{T}_A$ is called _relatively open_ in $A$.
properties:
  - >-
    The subspace topology on $A$ is the coarsest topology on $A$ such that the [inclusion map](/dictionary/definitions/inclusion-map) $\iota : A \hookrightarrow X$ is [continuous](/dictionary/definitions/continuous).
  - >-
    If the topology on $X$ comes from a [metric](/dictionary/definitions/metric) $d$, then the subspace topology on $A$ comes from the metric $d$ restricted to $A \times A$.
---
A set that is relatively open in $A$ need not be open in $X$.
A subset of a topological space is called [connected](/dictionary/definitions/connected) or [compact](/dictionary/definitions/compact) when the subset is connected or compact in the subspace topology.
