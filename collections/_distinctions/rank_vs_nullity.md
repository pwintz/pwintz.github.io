---
published: false
title: Rank vs. nullity
kind: siblings
areas: [linear-algebra]
summary: >
  The rank and the nullity of a matrix count two complementary kinds of directions, so the two numbers are easy to mix up.
  The [rank](/dictionary/definitions/matrix-rank) of a matrix $A$ is the dimension of its [column space](/dictionary/definitions/column-space): the number of [independent](/dictionary/definitions/linearly_independent) directions that $A x$ can reach.
  The [nullity](/dictionary/definitions/nullity) of $A$ is the dimension of its [kernel](/dictionary/definitions/kernel): the number of independent directions that $A$ sends to $0$.
  In the reduced row echelon form of $A$, the rank counts the columns with a [leading entry](/dictionary/definitions/leading-entry) and the nullity counts the columns without one, so for an $m \times n$ matrix, $\operatorname{rank} A + \operatorname{nullity} A = n$ (the rank–nullity theorem).
examples_note: >-
  Each cell is the ___ of the matrix in that row.
terms:
  - matrix_rank
  - nullity
examples:
  - example: identity_3_by_3
  - example: matrix_1_2_3_4
  - example: matrix_1_3_5_0_2_4
  - example: begin_bmatrix_1_2_2_4_end_bmatrix
  - example: ones_3_by_4
  - example: zero_2_by_2
see_also:
  - domain_codomain_column_space_null_space
  - meanings_of_rank
  - leading_entry_vs_pivot
---
