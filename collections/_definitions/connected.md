---
title: Connected Space
term: connected
applies_to: sets and topological spaces
levels:
  # TODO: Add a drawing that shows a shape formed of one or more components that can be dragged around. If they are dragged near each other, they merge (copy the visual style of the dating simulator tool). Show an indicator on the figure about whether or not it is connected.
  elementary:
    text: |-
      Think of a shape drawn on paper, which might be made of several separate pieces.
      The shape is _connected_ if it is all in one piece.
  undergraduate:
    context: topological spaces
    text: |-
      Consider a topological space $X$, and the ways to split it into two [open sets](/dictionary/definitions/open-set).
      The space $X$ is _connected_ if $X$ cannot be split into two disjoint, nonempty open sets: there are no open sets $U$ and $V$ such that $U \cup V = X$, $U \cap V = \emptyset$, $U \neq \emptyset$, and $V \neq \emptyset$.
properties:
  - |-
    The connected [subsets](/dictionary/definitions/subset) of $\reals$ are exactly the intervals.
  - |-
    The image of a connected space under a [continuous](/dictionary/definitions/continuous) map is connected.
    This is the intermediate value theorem in disguise.
---

In graph theory, a [connected graph](/dictionary/definitions/connected-graph) is a graph in which every two vertices are joined by a path, which is a different definition.
