---
published: false
title: Types of splitting
kind: family
areas: [sets]
status: draft
summary: >
  Several operations split something into pieces.
  Division splits a number.
  A partition splits a set into non-overlapping pieces, but a partition of an interval is a list of cut points whose pieces share endpoints.
  A refinement splits pieces further.
  Separated sets are disjoint and not even touching.
terms:
  - division
  - set_partition
  - interval_partition
  - refinement
  - separated_sets
examples:
  - example: set_set_1_2_set_3_for_the_set_set_1_2_3
    why: >-
      $\lbrace \lbrace 1, 2 \rbrace, \lbrace 3 \rbrace \rbrace$ is a partition of $\lbrace 1, 2, 3 \rbrace$ because its blocks are disjoint, nonempty, and cover the set.
  - example: set_set_1_2_set_2_3_for_the_set_set_1_2_3
    why: >-
      $\lbrace \lbrace 1, 2 \rbrace, \lbrace 2, 3 \rbrace \rbrace$ is not a partition of $\lbrace 1, 2, 3 \rbrace$, because its blocks overlap at $2$, so it is a cover.
  - example: set_set_1_set_2_set_3_compared_with_set_set_1_2
    why: >-
      $\lbrace \lbrace 1 \rbrace, \lbrace 2 \rbrace, \lbrace 3 \rbrace \rbrace$ is a partition of $\lbrace 1, 2, 3 \rbrace$.
      It is a refinement of $\lbrace \lbrace 1, 2 \rbrace, \lbrace 3 \rbrace \rbrace$ because each of its blocks is contained in a block of the other.
  - example: 0_lt_0_5_lt_1_for_the_interval_0_1
    why: >-
      The points $0 < 0.5 < 1$ give an interval partition of $[0, 1]$ into $[0, 0.5]$ and $[0.5, 1]$.
      It is not a set partition, because those subintervals share the point $0.5$.
  - example: open_0_1_and_open_1_2
    why: >-
      $(0, 1)$ and $(1, 2)$ are separated, because neither contains a point of the closure of the other.
  - example: closed_0_1_and_open_1_2
    why: >-
      $[0, 1]$ and $(1, 2)$ are disjoint, but not separated, because $1 \in [0, 1]$ is in the closure of $(1, 2)$.
see_also:
  - types_of_adding
  - disjoint_unions
---
