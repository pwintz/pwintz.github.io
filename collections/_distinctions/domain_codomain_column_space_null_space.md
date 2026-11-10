---
published: false
title: Domain vs. codomain vs. column space vs. null space of a matrix
kind: siblings
areas: [linear-algebra]
summary: >
  An $m \times n$ matrix $A$ defines the [linear map](/definitions/linear-map) $x \mapsto A x$, and four subspaces describe the inputs and outputs of the map.
  The [domain](/definitions/domain) is $\reals^n$, the space of inputs, whose dimension is the number of columns.
  The [codomain](/definitions/codomain) (or target) is $\reals^m$, the space where outputs land, whose dimension is the number of rows.
  The [column space](/definitions/column-space), which is the [image](/definitions/image) of the map, is the set of outputs $A x$ that actually occur, a subspace of the codomain.
  The [null space](/definitions/kernel), also called the kernel, is the set of inputs $x$ such that $A x = 0$, a subspace of the domain.
relation: |-
  null space ⊆ domain $= \reals^n$, and column space ⊆ codomain $= \reals^m$.
terms:
  - domain
  - codomain
  - column_space
  - kernel
examples:
  - example: begin_bmatrix_1_2_2_4_end_bmatrix
    why: >-
      For the square matrix with rows $(1, 2)$ and $(2, 4)$, the domain and codomain are both $\reals^2$, but the column space and the null space are different lines.
  - example: begin_bmatrix_1_0_2_0_1_3_end_bmatrix
    why: >-
      For the $2 \times 3$ matrix with rows $(1, 0, 2)$ and $(0, 1, 3)$, the null space is a line in the domain $\reals^3$, and the column space is the whole codomain $\reals^2$.
see_also:
  - domain_vs_codomain_vs_image
  - meanings_of_range
  - meanings_of_rank
---
## Notes

- The rank–nullity theorem relates the dimensions: $\dim \operatorname{col} A + \dim \ker A = n$, the dimension of the domain.
- "Range" sometimes means the [column space](/definitions/column-space) and sometimes the [codomain](/definitions/codomain); see [meanings of range](/distinctions/meanings-of-range).
