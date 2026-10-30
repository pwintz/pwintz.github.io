---
published: false
title: Boundary of a set
term: boundary
applies_to: sets
synonyms: [frontier, $\partial A$]
levels:
  elementary:
    text: |-
      The _boundary_ of a shape is its edge or border, where the inside meets the outside.
    caveat: >-
      In mathematics, the boundary of a solid [ball](/definitions/ball) is its whole spherical surface, not just an outline.
  undergraduate:
    context: subsets of $\reals^n$
    text: |-
      A point $x$ is in the _boundary_ of $A$ if every [open ball](/definitions/open-ball) around $x$ contains both a point of $A$ and a point not in $A$.
  graduate:
    context: topological spaces
    text: |-
      The _boundary_ of $A$ is $\partial A = \overline{A} \setminus \operatorname{int}(A)$, the closure of $A$ minus its interior.
properties:
  - >-
    $\partial A = \overline{A} \cap \overline{X \setminus A}$, so a set and its complement have the same boundary.
  - >-
    The boundary of a set is always closed.
  - >-
    A set is closed if and only if it contains its boundary, and open if and only if it is disjoint from its boundary.
---
