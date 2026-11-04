---
published: false
title: Types of adding
kind: family
areas: [sets]
status: draft
summary: >
  "Add" is used informally for many ways of combining things.
  Addition combines numbers (or vectors); union combines sets; insert, append, and prepend put one element into a collection; concatenation joins lists; and a Minkowski sum adds sets element by element.
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
      $1 + 2 = 3$ is addition because it combines two numbers into their sum.
  - example: collecting_set_1_2_and_set_2_3_into_one_set
    why: >-
      Collecting the elements into one set is a union, so the shared element $2$ appears once.
      It is not concatenation, which keeps order and repeats, and it is not a Minkowski sum, which adds elements together.
  - example: joining_1_2_and_2_3_end_to_end
    why: >-
      Joining two lists end to end is concatenation, which keeps the order and the repeated $2$.
      It is not a union, which would remove the repeated $2$ and ignore order.
  - example: adding_each_element_of_set_1_2_to_set_2_3
    why: >-
      Adding each element of one set to each element of the other is the Minkowski sum: the sums $1 + 2$, $1 + 3$, $2 + 2$, and $2 + 3$ give $\lbrace 3, 4, 5 \rbrace$.
      It is not a union, which would give $\lbrace 1, 2, 3 \rbrace$.
  - example: appending_4_to_1_2_3
    why: >-
      Appending $4$ inserts a single element at the end of the list.
      It is not prepending, which adds at the beginning, and it is not concatenation, which joins two lists.
  - example: prepending_4_to_1_2_3
    why: >-
      Prepending $4$ inserts a single element at the beginning of the list.
      It is not appending, which adds at the end.
  - example: inserting_2_into_set_1_2
    why: >-
      Inserting $2$ into $\lbrace 1, 2 \rbrace$ is insertion, and it does not change the set, because $2$ is already in it.
      It is not appending, because sets have no "end."
see_also:
  - disjoint_unions
  - types_of_splitting
---
## Notes

- "Sum" usually means the result of addition, but also appears in "direct sum" of vector spaces and "Minkowski sum" of sets.
- To _refine_ a partition or cover is to split its pieces further, which adds pieces but is not addition.
  See [types of splitting](/distinctions/types-of-splitting).
