---
published: false
title: Types of adding
kind: family
areas: [sets]
status: draft
summary: >
  "Add" is used informally for many ways of combining things. Addition combines numbers (or vectors); union combines sets;
  insert, append, and prepend put one element into a collection; concatenation joins lists; and a Minkowski sum adds sets element by element.
terms:
  - addition
  - set_union
  - insert
  - append
  - prepend
  - concatenate
  - minkowski_sum
examples:
  - example: 1_plus_2_eq_3
    why: >-
      Combining two numbers.
  - example: set_1_2_and_set_2_3_give_set_1_2_3
    why: >-
      The shared element $2$ appears once.
  - example: 1_2_and_2_3_give_1_2_2_3
    why: >-
      Order is kept, and so is the repeated $2$.
  - example: set_1_2_and_set_2_3_give_set_3_4_5
    why: >-
      The sums $1 + 2$, $1 + 3$, $2 + 2$, and $2 + 3$.
  - example: 1_2_3_and_4_give_1_2_3_4
    why: >-
      A single element is added at the end. Concatenation joins two lists.
  - example: 1_2_3_and_4_give_4_1_2_3
    why: >-
      Prepending adds the new element at the beginning instead of the end.
  - example: set_1_2_and_2_give_set_1_2
    why: >-
      Inserting an element that is already in a set does not change the set, and sets have no "end."
see_also:
  - disjoint_unions
  - types_of_splitting
---
## Notes

- "Sum" usually means the result of addition, but also appears in "direct sum" of vector spaces and "Minkowski sum" of sets.
- To _refine_ a partition or cover is to split its pieces further, which adds pieces but is not addition. See [types of splitting](/distinctions/types-of-splitting).
