---
title: 'The north pole $p = (0, 0, 1)$ and the point $q = (1, 0, 0)$ on the equator of the unit sphere in $\reals^3$'
level: high-school
values:
  euclidean_distance: '$d_2(p, q) = \sqrt{1^2 + 0^2 + 1^2} = \sqrt{2} \approx 1.41$'
  taxicab_distance: '$d_1(p, q) = 1 + 0 + 1 = 2$'
  chebyshev_distance: '$d_{\infty}(p, q) = \max(1, 0, 1) = 1$'
  discrete_metric: '$d(p, q) = 1$'
  geodesic_distance: '$\frac{\pi}{2} \approx 1.57$'
why:
  discrete_metric: >-
    The discrete distance between $p = (0, 0, 1)$ and $q = (1, 0, 0)$ is $1$, because $p \neq q$.
  geodesic_distance: >-
    The geodesic distance on the unit sphere from the north pole to a point on the equator is the length of a quarter of a great circle, $\frac{2 \pi}{4} = \frac{\pi}{2}$.
  euclidean_distance: >-
    The Euclidean distance $\sqrt{2} \approx 1.41$ is shorter, because the straight segment cuts through the inside of the sphere.
---
