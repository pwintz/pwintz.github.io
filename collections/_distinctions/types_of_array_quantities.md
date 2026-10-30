---
published: false
title: Number of elements vs. shape vs. number of axes
kind: siblings
areas: [computing, linear-algebra]
status: draft
summary: >
  The number of axes of an array is how many indices pick out an entry. The shape lists the length along each axis,
  and the number of elements is the product of those lengths.
terms:
  - array_size
  - array_shape
  - array_rank
examples_note: >-
  Each cell is the ___ of the array in that row.
examples:
  - example: ones_3_by_4
    why: >-
      It takes two indices (row and column) to pick out one of its $3 \times 4 = 12$ entries.
  - example: vector_123_array
    why: >-
      It takes one index to pick out one of its $3$ entries.
see_also:
  - meanings_of_rank
  - meanings_of_size_of_array
  - meanings_of_dimension
  - array_vs_matrix_vs_linear_map
---
## Notes

Each of these quantities is often called by a word with conflicting meanings:

- the number of axes is called the "rank" or the "number of dimensions" (see [the meanings of "rank"](/distinctions/meanings-of-rank) and [the meanings of "dimension"](/distinctions/meanings-of-dimension)), and
- the number of elements and the shape are both called the "size" (see [the meanings of "size"](/distinctions/meanings-of-size-of-array)).
