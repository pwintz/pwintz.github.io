---
published: false
title: Limit point vs. isolated point vs. adherent point
kind: siblings
areas: [topology, analysis]
summary: >
  The points near a set $S$ are classified by how points of $S$ crowd around them.
  A point $x$ is a [limit point](/dictionary/definitions/limit-point) (point of accumulation) of $S$ if points of $S$ other than $x$ come arbitrarily close to $x$, and $x$ need not belong to $S$.
  A point $x$ of $S$ is an [isolated point](/dictionary/definitions/isolated-point) of $S$ if some [neighborhood](/dictionary/definitions/neighborhood) of $x$ meets $S$ only at $x$.
  A point $x$ is an [adherent point](/dictionary/definitions/adherent-point) of $S$ if points of $S$, possibly including $x$ itself, come arbitrarily close to $x$; the adherent points of $S$ are the limit points of $S$ together with the isolated points of $S$, and the adherent points form the closure of $S$.
terms:
  - limit_point
  - isolated_point
  - adherent_point
examples:
  - example: zero_for_the_interval_0_1_half_open
  - example: sqrt_2_for_rationals
  - example: one_for_1_union_2_3
  - example: one_half_for_reciprocals
see_also:
  - interior_vs_exterior_vs_boundary
  - types_of_limits
---
## Notes

- For [sequences](/dictionary/definitions/sequence), "limit point" and "[cluster point](/dictionary/definitions/limit-point)" sometimes mean a limit of a subsequence, which is different from a limit point of the set of terms.
  The constant sequence $1, 1, 1, \dots$ has the subsequential limit $1$, but its set of terms, $\setdef{1}$, has no limit points.
