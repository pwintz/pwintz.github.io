---
published: false
title: Leading entry vs. pivot
kind: siblings
areas: [linear-algebra]
status: draft
summary: >
  Every nonzero row of every matrix has a leading entry: its first nonzero entry.
  Pivots belong to echelon forms: they are the leading entries after Gaussian elimination.
  In a matrix that is not in echelon form, a leading entry need not be in a pivot position.
terms:
  - leading_entry
  - pivot
examples:
  - example: matrix_1_3_5_0_2_4
    why: >-
      This matrix is already in row echelon form, so its leading entries, $1$ and $2$, are its pivots.
  - example: matrix_0_2_4_1_3_5
    why: >-
      The leading entry of row $1$ is the $2$ in column $2$, because the row starts with $0$.
      The first pivot is in column $1$, since row reduction swaps the rows to put the $1$ first.
  - example: leading_entry_not_pivot
    why: >-
      The $2$ is the leading entry of row $1$, because it is the first nonzero entry of that row.
      It is not a pivot, because after row reduction (which swaps the rows), the pivots are in positions $(1, 1)$ and $(2, 2)$.
see_also:
  - array_vs_matrix_vs_linear_map
---
## Notes

- Some books use "pivot" for the number in a pivot position and "pivot position" for its location; others use "pivot" for both.
- To practice finding pivots, see the [Gaussian elimination practice tool](/tools/gaussian_elimination_practice/) and the [RREF study tool](/tools/rref_study_tool/).
