---
published: false
title: Array vs. tensor
kind: siblings
areas: [linear-algebra, computing]
summary: >
  Multidimensional arrays of numbers are often called tensors, because the components of a tensor form an array.
  An [array](/dictionary/definitions/array) is a grid of entries indexed by several [integers](/dictionary/definitions/integer), with no further meaning.
  A [tensor](/dictionary/definitions/tensor) is a multilinear function of vectors and [covectors](/dictionary/definitions/covector); the array of components of a tensor depends on a choice of [basis](/dictionary/definitions/vector-basis), and the components change by a fixed rule when the basis changes.
  Machine learning libraries use "tensor" to mean an array.
terms:
  - array
  - tensor
examples:
  - example: a_2_by_3_by_4_block_of_numbers
  - example: a_pytorch_tensor
  - example: dot_product_on_R2_as_bilinear_function
see_also:
  - array_vs_matrix_vs_linear_map
  - meanings_of_rank
  - vector_vs_vector_coordinate
---
## Notes

- In physics, "[tensor](/dictionary/definitions/tensor)" usually means a tensor field, such as the stress tensor, which has a tensor at each point of a material.
- A matrix can be the array of components of a [linear map](/dictionary/definitions/linear-map) (a tensor of type $(1, 1)$) or of a [bilinear form](/dictionary/definitions/bilinear-form) (a tensor of type $(0, 2)$), and these two change differently when the [basis](/dictionary/definitions/vector-basis) changes.
