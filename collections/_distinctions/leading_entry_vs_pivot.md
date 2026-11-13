---
published: false
title: Leading entry vs. pivot
kind: siblings
areas: [linear-algebra]
summary: >
  Row reduction refers to special entries of a matrix by two names that are easy to confuse.
  Every nonzero row of every matrix has a [leading entry](/dictionary/definitions/leading-entry): its first nonzero entry.
  Pivots belong to echelon forms: they are the leading entries after Gaussian elimination.
  In a matrix that is not in echelon form, a leading entry need not be in a pivot position.
terms:
  - leading_entry
  - pivot
examples:
  - example: matrix_1_3_5_0_2_4
  - example: matrix_0_2_4_1_3_5
  - example: leading_entry_not_pivot
  - example: matrix_1_2_3_4
    why: >-
      The $3$ in row $2$ of $$\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$ is a leading entry but not a pivot, and the pivot $-2$ of the echelon form is not an entry of the original matrix.
see_also:
  - array_vs_matrix_vs_linear_map
  - rank_vs_nullity
---
## Notes

- Some books use "pivot" for the number in a pivot position and "pivot position" for its location; others use "pivot" for both.
- To practice finding pivots, see the [Gaussian elimination practice tool](/tools/gaussian_elimination_practice/) and the [RREF study tool](/tools/rref_study_tool/).
