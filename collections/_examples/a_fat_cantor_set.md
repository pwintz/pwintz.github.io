---
title: 'A "fat" Cantor set'
level: graduate
is: [
  nowhere_dense,
  meager_set,
  borel_set
]
is_not: [measure_zero]
why:
  nowhere_dense: >-
    A fat Cantor set is nowhere dense, because it contains no interval.
  measure_zero: >-
    A fat Cantor set does not have measure zero, because the intervals removed in its construction are small enough that it keeps a positive length.
  meager_set: >-
    A fat Cantor set is meager, because it is nowhere dense, even though its measure is positive.
  borel_set: >-
    A fat Cantor set is a Borel set, because it is closed: it is the intersection of the finite unions of closed intervals that remain after each step of its construction.
---
