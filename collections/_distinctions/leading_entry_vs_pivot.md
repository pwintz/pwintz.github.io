---
published: false
title: Leading entry vs. pivot
kind: siblings
areas: [linear-algebra]
summary: >
  Row reduction refers to special entries of a matrix by two names that are easy to confuse.
  Every nonzero row of every matrix has a [leading entry](/definitions/leading-entry): its first nonzero entry.
  Pivots belong to echelon forms: they are the leading entries after Gaussian elimination.
  In a matrix that is not in echelon form, a leading entry need not be in a pivot position.
terms:
  - leading_entry
  - pivot
examples:
  - example: matrix_1_3_5_0_2_4
  - example: matrix_0_2_4_1_3_5
  - example: leading_entry_not_pivot
see_also:
  - array_vs_matrix_vs_linear_map
---
## Notes

- Some books use "pivot" for the number in a pivot position and "pivot position" for its location; others use "pivot" for both.
- To practice finding pivots, see the [Gaussian elimination practice tool](/tools/gaussian_elimination_practice/) and the [RREF study tool](/tools/rref_study_tool/).
