---
published: false
title: Separated sets
term: separated
applies_to: pairs of sets
levels:
  graduate:
    context: topology
    text: |-
      Consider two sets $A$ and $B$ in a topological space, with closures $\overline{A}$ and $\overline{B}$.
      The sets are _separated_ if each is disjoint from the closure of the other:

      $$A \cap \overline{B} = \emptyset \quad \text{and} \quad \overline{A} \cap B = \emptyset.$$
properties:
  - >-
    A space is disconnected exactly when it is the [union](/definitions/set-union) of two nonempty separated sets.
  - >-
    Separated sets are disjoint, but disjoint sets need not be separated: $[0, 1]$ and $(1, 2]$ are disjoint but not separated.
---
