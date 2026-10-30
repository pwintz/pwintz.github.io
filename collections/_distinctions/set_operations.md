---
published: false
title: Types of set operations
kind: siblings
areas: [sets]
status: draft
summary: >
  The union of two sets contains everything in either set, and the intersection contains everything in both.
  The set difference $A \setminus B$ contains what is in $A$ but not in $B$. Union and intersection do not depend on the order of $A$ and $B$, but set difference does.
terms:
  - set_union
  - set_intersection
  - set_difference
examples_note: >-
  Each cell is the ___ of the sets $A$ and $B$ in that row.
examples:
  - example: sets_123_and_234
    why: >-
      The union has everything in $A$ or $B$ (or both); the intersection has everything in both. In the other order, $B \setminus A = \lbrace 4 \rbrace$.
  - example: sets_12_and_34
    why: >-
      $A$ and $B$ have nothing in common, so their intersection is empty, and removing $B$ from $A$ changes nothing.
see_also:
  - disjoint_unions
  - types_of_adding
  - types_of_difference
---
## Notes

- The _symmetric difference_ $(A \setminus B) \cup (B \setminus A)$, here $\lbrace 1, 4 \rbrace$, contains what is in exactly one of the two sets.
- "Disjoint union" has two conflicting meanings, so it is not listed here. See [disjoint union](/distinctions/disjoint-unions).
