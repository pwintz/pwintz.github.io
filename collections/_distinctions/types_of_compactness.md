---
published: false
title: Types of compactness
kind: family
areas: [topology, analysis]
status: draft
summary: >
  Compactness is a strong finiteness condition.
  Sequential compactness is the version based on sequences, which agrees with compactness in metric spaces.
  Local compactness asks for compactness only near each point, and paracompactness is a weaker global condition that every metric space satisfies.
terms:
  - compact
  - sequentially_compact
  - locally_compact
  - paracompact
examples:
  - example: closed_unit_interval
    why: >-
      $[0, 1]$ is compact because it is closed and bounded in $\reals$.
      So it is also sequentially compact (it is a metric space), locally compact, and paracompact.
  - example: reals
    why: >-
      $\reals$ is locally compact because every point has the compact neighborhood $[x - 1, x + 1]$, and it is paracompact because it is a metric space.
      It is not compact or sequentially compact, because the sequence $1, 2, 3, \dots$ has no convergent subsequence.
  - example: rationals
    why: >-
      $\mathbb{Q}$ is paracompact because it is a metric space.
      It is not locally compact, because no neighborhood of a point has a compact closure, so it is not compact or sequentially compact either.
  - example: the_closed_unit_ball_of_ell_squared
    why: >-
      The closed unit ball of $\ell^2$ is paracompact because it is a metric space.
      It is closed and bounded, but not compact or sequentially compact, because the standard basis vectors have no convergent subsequence, and it is not locally compact.
  - example: the_ordinals_0_omega_1_with_the_order_topology
    why: >-
      $[0, \omega_1)$ is sequentially compact because every sequence is bounded below $\omega_1$, so it lies in a compact interval, and it is locally compact.
      It is not compact, because the cover by the sets $[0, \alpha)$ has no finite subcover, and it is not paracompact.
  - example: unit_interval_power_with_the_product_topology
    why: >-
      $[0, 1]^{[0, 1]}$ is compact by Tychonoff's theorem, so it is also locally compact and paracompact.
      It is not sequentially compact, because some sequences in it have no convergent subsequence.
see_also:
  - connected_vs_path_connected_vs_simply_connected
  - types_of_finite
  - types_of_topological_spaces
---
