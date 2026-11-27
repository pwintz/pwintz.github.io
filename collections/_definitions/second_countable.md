---
title: Second-Countable Space
term: second countable
applies_to: topological spaces
synonyms: [second-countable, satisfies the second axiom of countability]
levels:
  undergraduate:
    context: topological spaces
    text: |-
      Consider a [topological space](/dictionary/definitions/topological-space) $X$.
      The space $X$ is _second countable_ if there is a [countable](/dictionary/definitions/countable) [basis](/dictionary/definitions/topological-basis) $\mathcal{B}$ for the [topology](/dictionary/definitions/topology) of $X$.
      Such a basis $\mathcal{B}$ is a countable collection of [open sets](/dictionary/definitions/open-set) in $X$ such that, for every open set $U$ and every point $x \in U$, there is a set $B \in \mathcal{B}$ such that

      $$x \in B \subseteq U.$$
properties:
  - |-
    Every second-countable space is [first countable](/dictionary/definitions/first-countable), because the sets in a [countable](/dictionary/definitions/countable) basis that contain a point $x$ form a countable [neighborhood](/dictionary/definitions/neighborhood) basis at $x$.
  - |-
    Every subspace of a second-countable space is second countable.
  - |-
    Every second-countable space is separable, meaning that it has a [countable](/dictionary/definitions/countable) [dense](/dictionary/definitions/dense-set) [subset](/dictionary/definitions/subset).
  - |-
    A [metric space](/dictionary/definitions/metric-space) is second countable if and only if it is separable.
---
Second countability is one of the conditions in the definition of a [manifold](/dictionary/definitions/manifold).
Together with the [Hausdorff](/dictionary/definitions/hausdorff-space) condition, second countability makes every manifold [paracompact](/dictionary/definitions/paracompact), so partitions of unity exist on every manifold.
