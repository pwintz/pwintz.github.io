---
published: false
title: Finite vs. bounded vs. convergent vs. compact
kind: siblings
areas: [analysis, sets]
summary: >
  Several properties describe a set or sequence that is "not too big," in different senses.
  A finite set has finitely many elements.
  A [bounded](/definitions/bounded) set fits inside a [ball](/definitions/ball), and may have [infinitely many elements](/definitions/infinite-set).
  A [compact](/definitions/compact) set is bounded and (in $\reals^n$) closed.
  A convergent sequence has a limit, which makes it bounded, but not every bounded sequence converges.
terms:
  - finite_set
  - bounded
  - convergent
  - compact
examples:
  - example: set_1_2_3
  - example: closed_unit_interval
  - example: open_unit_interval
  - example: naturals
  - example: the_sequence_1_1_over_2_1_over_3_etc
  - example: sequence_alternating
see_also:
  - types_of_infinity
  - types_of_compactness
---
## Finite values vs. bounded functions

The function $f(x) = 1/x$ on $(0, 1]$ has a finite value at every point, but it is not [bounded](/definitions/bounded).
"Finite everywhere" and "bounded" are different conditions.

## Constrained

"Constrained" is not a technical term on its own.
In optimization, a constrained variable is required to satisfy given conditions, such as $g(x) \leq 0$.
A [constraint set](/definitions/admissible-set) can be unbounded, such as $\setdef{x \suchthat x \geq 0}$.
