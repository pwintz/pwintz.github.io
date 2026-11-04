---
published: false
title: Exterior of a set
term: exterior
applies_to: sets
synonyms: ['$\operatorname{ext} A$']
levels:
  elementary:
    text: |-
      Think of a shape drawn on paper, with an inside, an edge, and an outside.
      The _exterior_ of the shape is everything outside it, not including its edge.
  undergraduate:
    context: subsets of $\reals^n$
    text: |-
      Consider a set $A \subseteq \reals^n$ and a point $x$.
      The point $x$ is in the _exterior_ of $A$ if some [open ball](/definitions/open-ball) around $x$ contains no point of $A$.
  graduate:
    context: topological spaces
    text: |-
      Consider a subset $A$ of a topological space $X$.
      The _exterior_ of $A$ is the [interior](/definitions/interior) of its complement, $\operatorname{int}(X \setminus A)$.
properties:
  - |-
    The exterior of a set is open.
  - |-
    The [interior](/definitions/interior), [boundary](/definitions/boundary), and exterior of a set are disjoint, and together they make up the whole space.
---
