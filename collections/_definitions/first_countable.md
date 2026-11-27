---
title: First-Countable Space
term: first countable
applies_to: topological spaces
synonyms: [first-countable, satisfies the first axiom of countability]
levels:
  graduate:
    context: topological spaces
    text: |-
      A [topological space](/dictionary/definitions/topological-space) $X$ is called _first countable_ if, for every point $x \in X$, there is a sequence $N_1, N_2, \dots$ of [neighborhoods](/dictionary/definitions/neighborhood) of $x$ such that for every neighborhood $U$ of $x$,

      $$N_k \subseteq U \quad \text{for some } k.$$

      The sequence $N_1, N_2, \dots$ is called a _countable neighborhood basis_ at $x$.
    figure:
      widget: neighborhood-basis
      caption: |-
        In the plane, the open balls $N_k$ of radius $1/k$ centered at $x$ form a countable neighborhood basis at $x$.
        Drag the point $x$ or the open set $U$ (which stays over $x$), and shrink $U$ with the slider: while $x \in U$, some ball $N_k$ lies inside $U$.
      alt: Dashed circles of radius 1, 1/2, 1/3, and so on around a point x, and a shaded open set U that can be dragged and shrunk. The first circle inside U is highlighted.
properties:
  - |-
    Every [metric space](/dictionary/definitions/metric-space) is first countable, because, at each point $x$, the [open balls](/dictionary/definitions/open-ball) of radius $1/k$ centered at $x$ form a [countable](/dictionary/definitions/countable) [neighborhood](/dictionary/definitions/neighborhood) basis.
  - |-
    Every second-countable space is first countable.
  - |-
    In a first-countable space $X$, a point $x$ is in the closure of a set $A \subseteq X$ if and only if some sequence in $A$ converges to $x$.
  - |-
    A function on a first-countable space is [continuous](/dictionary/definitions/continuous) if and only if it is [sequentially continuous](/dictionary/definitions/sequentially-continuous).
---
