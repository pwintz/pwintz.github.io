---
published: false
title: "Disjoint union: union of disjoint sets vs. tagged union"
kind: conflicting
areas: [sets]
status: draft
summary: >
  "Disjoint union" can mean an ordinary union of sets that happen to be disjoint,
  or a construction that tags each element with the set it came from, so that copies of overlapping sets are kept apart.
terms:
  - union_of_disjoint_sets
  - disjoint_union
examples_note: >-
  Each cell is the disjoint union of $A$ and $B$, in the ___ sense. In the tagged sense, each element is paired with a tag, $1$ for $A$ or $2$ for $B$.
examples:
  - example: sets_1_and_2
    why: >-
      $A$ and $B$ are disjoint, so their union is a union of disjoint sets. The tagged disjoint union is usually identified with it.
  - example: sets_12_and_23
    why: >-
      $A$ and $B$ overlap, so their ordinary union $\lbrace 1, 2, 3 \rbrace$ is not a disjoint union in either sense. The tagged disjoint union keeps both copies of $2$, so it has $4$ elements.
see_also:
  - set_operations
  - types_of_adding
  - types_of_collections
---
## Notes

- When $A$ and $B$ are disjoint, the two meanings agree up to a natural bijection, so many authors use them interchangeably.
- The tagged disjoint union always has $\lvert A \rvert + \lvert B \rvert$ elements, even when $A$ and $B$ overlap. For example, $\reals \sqcup \reals$ is two separate copies of the real line.
