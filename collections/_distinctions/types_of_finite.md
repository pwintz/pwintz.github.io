---
published: false
title: Finite vs. bounded vs. convergent vs. compact
kind: siblings
areas: [analysis, sets]
status: draft
summary: >
  A finite set has finitely many elements. A bounded set fits inside a ball, and may have infinitely many elements.
  A compact set is bounded and (in $\reals^n$) closed. A convergent sequence has a limit, which makes it bounded, but not every bounded sequence converges.
terms:
  - finite_set
  - bounded
  - convergent
  - compact
examples:
  - example: set_1_2_3
    why: >-
      Every finite subset of $\reals$ is compact.
  - example: closed_unit_interval
    why: >-
      It is closed and bounded, with infinitely many elements.
  - example: open_unit_interval
    why: >-
      It is not closed. The sequence $1/n$ has no limit in $(0, 1)$.
  - example: naturals
    why: >-
      It has arbitrarily large elements.
  - example: the_sequence_1_1_over_2_1_over_3_etc
    why: >-
      It converges to $0$.
  - example: sequence_alternating
    why: >-
      It is bounded but oscillates.
see_also:
  - types_of_infinity
  - types_of_compactness
---
## Finite values vs. bounded functions

The function $f(x) = 1/x$ on $(0, 1]$ has a finite value at every point, but it is not bounded. "Finite everywhere" and "bounded" are different conditions.

## Constrained

"Constrained" is not a technical term on its own. In optimization, a constrained variable is required to satisfy given conditions, such as $g(x) \leq 0$. A constraint set can be unbounded, such as $\lbrace x : x \geq 0 \rbrace$.
