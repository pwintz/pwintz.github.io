---
title: Types of distances
kind: siblings
areas: [geometry, topology]
summary: >
  A [metric](/dictionary/definitions/metric) measures how far apart two points are, and the same two points can be at different distances under different metrics.
  The Euclidean distance is the [straight-line distance](/dictionary/definitions/euclidean-distance), the [taxicab distance](/dictionary/definitions/taxicab-distance) travels along the axes, and the [Chebyshev distance](/dictionary/definitions/chebyshev-distance) takes the largest difference in one coordinate.
  The [geodesic distance](/dictionary/definitions/geodesic-distance) is the length of the shortest path that stays on a surface, such as the great-circle distance on the Earth.
  The [discrete metric](/dictionary/definitions/discrete-metric) only says whether two points are equal.
terms:
  - euclidean_distance
  - taxicab_distance
  - chebyshev_distance
  - geodesic_distance
  - discrete_metric
examples_note: >-
  Each cell is the distance between the two points in that row.
examples:
  - example: points_1_1_and_4_5
    why: >-
      The points $(1, 1)$ and $(4, 5)$ differ by $3$ in the first coordinate and $4$ in the second.
  - example: points_0_0_and_2_0
    why: >-
      Only the discrete metric differs.
  - example: points_0_0_and_100_100
    why: >-
      In the discrete metric, they are at distance $1$, the same as every two different points, so the discrete metric does not measure size at all.
  - example: north_pole_and_equator_point
see_also:
  - types_of_norms
  - types_of_inner_products
  - norm_vs_metric_vs_inner_product
  - types_of_difference
---
## Notes

- The Euclidean, taxicab, and [Chebyshev distances](/dictionary/definitions/chebyshev-distance) come from the [Euclidean norm](/dictionary/definitions/euclidean-norm), the [1-norm](/dictionary/definitions/one-norm), and the [infinity norm](/dictionary/definitions/infinity-norm), as $d(p, q) = \norm{p - q}$.
- The unit "[circles](/dictionary/definitions/circle)" $\setdef{q \in \reals^2 \suchthat d(0, q) = 1}$ are a circle, a diamond, and a square, and for the [discrete metric](/dictionary/definitions/discrete-metric), every point other than $0$.
- Great-circle distance is the [geodesic distance](/dictionary/definitions/geodesic-distance) on a [sphere](/dictionary/definitions/sphere). It does not come from a [norm](/dictionary/definitions/norm), because a sphere is not a vector space; see [norm vs. metric vs. inner product](/dictionary/distinctions/norm-vs-metric-vs-inner-product).
- A distance needs only a set of points, not a vector space.
  The Euclidean, taxicab, and Chebyshev distances use the coordinates of $\reals^n$, the geodesic distance needs a surface (or manifold) along which to measure paths, and the discrete metric works on every set.
