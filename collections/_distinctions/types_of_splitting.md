---
published: false
title: Types of splitting
kind: family
areas: [sets]
status: draft
summary: >
  Division splits a number. A partition splits a set into non-overlapping pieces, but a partition of an interval is a list of cut points whose pieces share endpoints.
  A refinement splits pieces further. Separated sets are disjoint and not even touching.
terms:
  - division
  - set_partition
  - interval_partition
  - refinement
  - separated_sets
examples:
  - example: set_set_1_2_set_3_for_the_set_set_1_2_3
    why: >-
      The blocks are disjoint, nonempty, and cover the set.
  - example: set_set_1_2_set_2_3_for_the_set_set_1_2_3
    why: >-
      The blocks overlap at $2$, so this is a cover, not a partition.
  - example: set_set_1_set_2_set_3_compared_with_set_set_1_2
    why: >-
      Each block of the first is contained in a block of the second.
  - example: 0_lt_0_5_lt_1_for_the_interval_0_1
    why: >-
      The subintervals $[0, 0.5]$ and $[0.5, 1]$ share the point $0.5$.
  - example: open_0_1_and_open_1_2
    why: >-
      Neither contains a point of the closure of the other.
  - example: closed_0_1_and_open_1_2
    why: >-
      They are disjoint, but $1 \in [0, 1]$ is in the closure of $(1, 2)$.
see_also:
  - types_of_adding
  - disjoint_unions
---
