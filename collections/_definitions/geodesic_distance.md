---
title: Geodesic distance
term: geodesic distance
applies_to: points on a surface or in a space
synonyms: [intrinsic distance, path-length distance]
levels:
  high-school:
    text: |-
      Consider two points $p$ and $q$ on a surface, such as two cities on the Earth.
      The _geodesic distance_ between $p$ and $q$ is the length of the shortest path from $p$ to $q$ that stays on the surface.
    caveat: >-
      On a [sphere](/dictionary/definitions/sphere), the shortest path follows a great [circle](/dictionary/definitions/circle), so the geodesic distance is the great-circle distance.
  graduate:
    context: Riemannian manifolds
    text: |-
      Consider a [connected](/dictionary/definitions/connected) Riemannian manifold $M$ and two points $p, q \in M$.
      The _geodesic distance_ between $p$ and $q$ is the [infimum](/dictionary/definitions/infimum) of the lengths of the piecewise smooth curves in $M$ from $p$ to $q$:

      $$d(p, q) = \inf \setdef{\int_0^1 \norm{\gamma^{\prime}(t)} \mathrm{d}t \suchthat \gamma(0) = p, \gamma(1) = q}.$$
properties:
  - >-
    The geodesic distance is at least the [Euclidean distance](/dictionary/definitions/euclidean-distance) through the surrounding space, because a straight segment is the shortest of all paths, including those that leave the surface.
  - >-
    In the plane (or in $\reals^n$), the geodesic distance is the [Euclidean distance](/dictionary/definitions/euclidean-distance), because the straight segment stays in the space.
  - >-
    A shortest path is called a _geodesic_.
    Geodesics need not be unique: every half great [circle](/dictionary/definitions/circle) from the north [pole](/dictionary/definitions/pole) to the south pole is a shortest path.
---
