---
title: Boundary of a set
term: boundary
applies_to: sets
synonyms: [frontier, $\partial A$]
levels:
  elementary:
    text: |-
      Consider a shape drawn on a piece of paper using a continuous line that forms a closed loop. 
      There is a portion of the paper that is inside the shape and a portion that is outside. 
      The _boundary_ of the shape is curve that separates the inside from the outside.
    # caveat: >-
      # In more than two dimensions, the boundary of a solid [ball](/definitions/ball) is its whole spherical surface, not just an outline.
  undergraduate:
    context: subsets of $\reals^n$
    text: |-
      Consider a set $A \subseteq \reals^n$ and a point $x$.
      The point $x$ is in the _boundary_ of $A$ if every [open ball](/definitions/open-ball) around $x$ contains both a point of $A$ and a point not in $A$.
  graduate:
    context: topological spaces
    text: |-
      Consider a subset $A$ of a topological space, with its closure $\overline{A}$ and its interior $\operatorname{int}(A)$.
      The _boundary_ of $A$ is $\partial A = \overline{A} \setminus \operatorname{int}(A)$.
properties:
  - >-
    $\partial A = \overline{A} \cap \overline{X \setminus A}$, so a set and its complement have the same boundary.
  - >-
    The boundary of every set is closed.
  - >-
    A set $A$ is closed if and only if it contains its boundary: $\partial A \subset A$, 
    
  - >-
    A set $A$ is open if and only if it is disjoint from its boundary: $\partial A \cap A = \emptyset$.
---
