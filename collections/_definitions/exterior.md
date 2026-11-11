---
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
      The point $x$ is in the _exterior_ of $A$ if there exists an [open ball](/dictionary/definitions/open-ball) around $x$ that does not contain any points in $A$.
  graduate:
    context: topological spaces
    text: |-
      Consider a [subset](/dictionary/definitions/subset) $A$ of a topological space $X$.
      The _exterior_ of $A$ is [union](/dictionary/definitions/set-union) of all [open sets](/dictionary/definitions/open-set) $E \subset X$ such that $A$ and $E$ are disjoint.
properties:
  - |-
    The exterior of a set is open.
  - |-
    The [interior](/dictionary/definitions/interior), [boundary](/dictionary/definitions/boundary), and exterior of a set are disjoint, and together they make up the whole space.
  - |-
    The _exterior_ of $A$ is the [interior](/dictionary/definitions/interior) of its complement, $\operatorname{int}(X \setminus A)$.
  - |-
    The _exterior_ of $A$ is not the complement of its [interior](/dictionary/definitions/interior).


---
