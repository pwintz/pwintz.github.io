---
title: 'The points $p = (0, 0)$ and $q = (2, 0)$ in $\reals^2$'
level: high-school
values:
  euclidean_distance: '$d_2(p, q) = \sqrt{2^2 + 0^2} = 2$'
  taxicab_distance: '$d_1(p, q) = 2 + 0 = 2$'
  chebyshev_distance: '$d_{\infty}(p, q) = \max(2, 0) = 2$'
  discrete_metric: '$d(p, q) = 1$'
  geodesic_distance: '$2$'
why:
  discrete_metric: >-
    The discrete distance between $p = (0, 0)$ and $q = (2, 0)$ is $1$, because $p \neq q$.
  geodesic_distance: >-
    In the plane, the geodesic distance between $p$ and $q$ equals the Euclidean distance, because the straight segment from $p$ to $q$ stays in the plane.
  chebyshev_distance: >-
    The points $(0, 0)$ and $(2, 0)$ lie on a line parallel to an axis, so the Euclidean, taxicab, and Chebyshev distances all equal $2$.
---
