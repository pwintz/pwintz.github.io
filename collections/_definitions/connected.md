---
published: false
title: Connected space
term: connected
applies_to: sets and topological spaces
levels:
  elementary:
    text: |-
      Think of a shape drawn on paper, which might be made of several separate pieces.
      The shape is _connected_ if it is all in one piece.
  undergraduate:
    context: topological spaces
    text: |-
      Consider a topological space $X$, and the ways to split it into two [open sets](/definitions/open-set).
      The space $X$ is _connected_ if $X$ cannot be split into two disjoint, nonempty open sets: there are no open sets $U$ and $V$ with $U \cup V = X$, $U \cap V = \emptyset$, $U \neq \emptyset$, and $V \neq \emptyset$.
properties:
  - |-
    The connected [subsets](/definitions/subset) of $\reals$ are exactly the intervals.
  - |-
    The image of a connected space under a [continuous](/definitions/continuous) map is connected.
    This is the intermediate value theorem in disguise.
---
