---
title: 'The points $p = (1, 1)$ and $q = (4, 5)$ in $\reals^2$'
level: high-school
values:
  euclidean_distance: '$d_2(p, q) = \sqrt{3^2 + 4^2} = 5$'
  taxicab_distance: '$d_1(p, q) = 3 + 4 = 7$'
  chebyshev_distance: '$d_{\infty}(p, q) = \max(3, 4) = 4$'
  geodesic_distance: '$5$'
  discrete_metric: '$d(p, q) = 1$'
why:
  discrete_metric: >-
    The discrete distance between $p = (1, 1)$ and $q = (4, 5)$ is $1$, because $p \neq q$.
  geodesic_distance: >-
    In the plane, the geodesic distance between $p$ and $q$ equals the Euclidean distance, because the straight segment from $p$ to $q$ stays in the plane.
  euclidean_distance: >-
    The straight-line distance is $5$, the distance along the axes is $3 + 4 = 7$, and the larger difference is $4$.
    Every pair of different points is at discrete distance $1$.
---
