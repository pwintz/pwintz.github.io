---
published: false
title: "Size of an array: number of elements vs. shape"
kind: conflicting
areas: [computing]
status: draft
summary: >
  In NumPy, the size of an array is its number of elements. In MATLAB, the size of an array is its shape: the length along each axis.
terms:
  - array_size
  - array_shape
examples_note: >-
  Each cell is the size of the array in that row, in the ___ sense.
examples:
  - example: ones_3_by_4
    why: >-
      In NumPy, `a.size` is $12$ and `a.shape` is `(3, 4)`. In MATLAB, `numel(A)` is $12$ and `size(A)` is `[3 4]`.
  - example: vector_123_array
    why: >-
      In NumPy, `a.size` is $3$ and `a.shape` is `(3,)`.
see_also:
  - types_of_array_quantities
  - types_of_size
---
## Notes

In mathematics, "size" is informal and can mean many things, such as cardinality, length, or norm. See [size, length, area, and related terms](/distinctions/types-of-size).
