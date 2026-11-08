---
title: 'The points $p = (0, 0)$ and $q = (100, 100)$ in $\reals^2$'
level: high-school
values:
  euclidean_distance: '$d_2(p, q) = \sqrt{100^2 + 100^2} = 100 \sqrt{2} \approx 141.42$'
  taxicab_distance: '$d_1(p, q) = 100 + 100 = 200$'
  chebyshev_distance: '$d_{\infty}(p, q) = \max(100, 100) = 100$'
  discrete_metric: '$d(p, q) = 1$'
  geodesic_distance: '$100 \sqrt{2}$'
why:
  discrete_metric: >-
    The discrete distance between $p = (0, 0)$ and $q = (100, 100)$ is $1$, because $p \neq q$.
  geodesic_distance: >-
    In the plane, the geodesic distance between $p$ and $q$ equals the Euclidean distance, because the straight segment from $p$ to $q$ stays in the plane.
  chebyshev_distance: >-
    The points $(0, 0)$ and $(100, 100)$ are far apart in the Euclidean, taxicab, and Chebyshev distances, which differ by factors of up to $2$.
---
