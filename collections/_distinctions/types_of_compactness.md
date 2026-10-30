---
published: false
title: Types of compactness
kind: family
areas: [topology, analysis]
status: draft
summary: >
  Compactness is a strong finiteness condition. Sequential compactness is the version based on sequences, which agrees with compactness in metric spaces.
  Local compactness asks for compactness only near each point, and paracompactness is a weaker global condition that every metric space satisfies.
terms:
  - compact
  - sequentially_compact
  - locally_compact
  - paracompact
examples:
  - example: closed_unit_interval
    why: >-
      Closed and bounded in $\reals$.
  - example: reals
    why: >-
      The sequence $1, 2, 3, \dots$ has no convergent subsequence.
  - example: rationals
    why: >-
      It is a metric space, so it is paracompact, but no neighborhood of a point has a compact closure.
  - example: the_closed_unit_ball_of_ell_squared
    why: >-
      Closed and bounded, but the standard basis vectors have no convergent subsequence.
  - example: the_ordinals_0_omega_1_with_the_order_topology
    why: >-
      Every sequence is bounded below $\omega_1$, so it lies in a compact interval, but the cover by the sets $[0, \alpha)$ has no finite subcover.
  - example: unit_interval_power_with_the_product_topology
    why: >-
      Compact by Tychonoff's theorem, but some sequences have no convergent subsequence.
see_also:
  - types_of_finite
  - types_of_topological_spaces
---
