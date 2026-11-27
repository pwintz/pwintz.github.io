---
title: Open Neighborhood
term: open neighborhood
applies_to: points
levels:
  high-school:
    context: real numbers
    text: |-
      Consider a real number $x$.
      An _open neighborhood_ of $x$ is an open interval $(a, b)$ such that

      $$a < x < b.$$
    caveat: |-
      At higher levels, an open neighborhood of $x$ is an open set that contains $x$, such as a union of several open intervals, one of which contains $x$.
  undergraduate:
    context: '$\reals^n$'
    text: |-
      Consider a point $x$ in $\reals^n$.
      An _open neighborhood_ of $x$ is an [open set](/dictionary/definitions/open-set) $U \subseteq \reals^n$ such that

      $$x \in U.$$
    # figure:
    #   widget: neighborhood
    #   params: { set: open, ball: false }
    #   caption: |-
    #     The open set $U$ does not include its boundary (dashed line).
    #     Drag $x$ to see whether $U$ is an open neighborhood of $x$.
    #   alt: A shaded open set U in the plane with a dashed boundary and a point x that can be dragged.
  graduate:
    context: topological spaces
    text: |-
      Consider a point $x$ in a [topological space](/dictionary/definitions/topological-space) $X$.
      An _open neighborhood_ of $x$ is an [open set](/dictionary/definitions/open-set) $U \subseteq X$ such that

      $$x \in U.$$
properties:
  - |-
    Every open neighborhood of $x$ is a [neighborhood](/dictionary/definitions/neighborhood) of $x$.
  - |-
    In $\reals$, every open neighborhood of $x$ contains an open interval $(a, b)$ such that $a < x < b$.
---
Some authors use "neighborhood" to mean "open neighborhood."
