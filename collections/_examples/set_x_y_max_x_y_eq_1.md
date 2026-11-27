---
title: '$\setdef{(x, y) \suchthat \max(\abs{x}, \abs{y}) = 1}$'
level: undergraduate
is: [
  sphere,
  sphere_topological
]
is_not: [circle]
why:
  sphere: >-
    The square $\setdef{(x, y) \suchthat \max(\abs{x}, \abs{y}) = 1}$ is not a sphere for the Euclidean norm, but is the unit sphere for the [max-norm distance](/dictionary/definitions/chebyshev-distance), so it is a sphere in that metric space.
  sphere_topological: >-
    The square $\setdef{(x, y) \suchthat \max(\abs{x}, \abs{y}) = 1}$ is a topological sphere, because the map $p \mapsto p / \norm{p}$ that pushes each point straight out (or in) to the unit circle $S^1$ is a homeomorphism.
  circle: >-
    The square $\setdef{(x, y) \suchthat \max(\abs{x}, \abs{y}) = 1}$ is not a circle, because its points are not all at the same Euclidean distance from the origin.
---
