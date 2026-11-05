---
published: false
title: Finite vs. bounded vs. convergent vs. compact
kind: siblings
areas: [analysis, sets]
status: draft
summary: >
  A finite set has finitely many elements.
  A bounded set fits inside a ball, and may have infinitely many elements.
  A compact set is bounded and (in $\reals^n$) closed.
  A convergent sequence has a limit, which makes it bounded, but not every bounded sequence converges.
terms:
  - finite_set
  - bounded
  - convergent
  - compact
examples:
  - example: set_1_2_3
    why: >-
      $\lbrace 1, 2, 3 \rbrace$ is a finite set, so it is bounded and compact, as is every finite subset of $\reals$.
  - example: closed_unit_interval
    why: >-
      $[0, 1]$ is compact because it is closed and bounded.
      It is not finite, because it has infinitely many elements.
  - example: open_unit_interval
    why: >-
      $(0, 1)$ is bounded.
      It is not compact, because it is not closed: the sequence $1/n$ has no limit in $(0, 1)$, and it is not finite.
  - example: naturals
    why: >-
      $\mathbb{N}$ is not bounded, because it has arbitrarily large elements.
      So it is not finite or compact.
  - example: the_sequence_1_1_over_2_1_over_3_etc
    why: >-
      The sequence $1, \frac{1}{2}, \frac{1}{3}, \dots$ is convergent because it converges to $0$.
      It is bounded because all of its terms are between $0$ and $1$.
  - example: sequence_alternating
    why: >-
      The sequence $1, -1, 1, -1, \dots$ is bounded because all of its terms are between $-1$ and $1$.
      It is not convergent, because it oscillates between $1$ and $-1$.
see_also:
  - types_of_infinity
  - types_of_compactness
---
## Finite values vs. bounded functions

The function $f(x) = 1/x$ on $(0, 1]$ has a finite value at every point, but it is not bounded.
"Finite everywhere" and "bounded" are different conditions.

## Constrained

"Constrained" is not a technical term on its own.
In optimization, a constrained variable is required to satisfy given conditions, such as $g(x) \leq 0$.
A constraint set can be unbounded, such as $\setdef{x \suchthat x \geq 0}$.
