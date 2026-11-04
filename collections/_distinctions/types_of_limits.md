---
published: false
title: Types of limits
kind: family
areas: [analysis]
status: draft
summary: >
  A sequence of real numbers might not have a limit, but every such sequence has a limit superior and a limit inferior (possibly infinite).
  A limit point belongs to a set, not a sequence.
terms:
  - limit_of_sequence
  - limsup
  - liminf
  - limit_point
examples_note: >-
  Each cell is the ___ of the sequence or set in that row.
examples:
  - example: sequence_one_over_n
    why: >-
      The sequence $1/n$ converges to $0$.
      When the limit exists, it equals the limit superior and the limit inferior.
  - example: sequence_alternating
    why: >-
      The terms keep returning to both $1$ and $-1$, so the sequence has no limit.
      Its limit superior and limit inferior are its largest and smallest subsequential limits, $1$ and $-1$.
  - example: set_of_reciprocals
    why: >-
      $0$ is a limit point of $S$ because points of $S$ get arbitrarily close to $0$, even though $0 \notin S$.
      No point of $S$ is a limit point, because each is isolated.
see_also:
  - types_of_limits_of_functions
  - types_of_extreme_values
  - types_of_extremal
  - types_of_infinity
---
