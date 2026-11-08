---
title: Metric
term: metric
applies_to: sets
synonyms: [distance function]
levels:
  high-school:
    text: |-
      A metric is a way of generalizing the concept of distance. 
      Consider a set of points, and a rule that gives a "distance" between every two of them.
      The rule is a _metric_ if 
      
      1. no distance is negative, 
      2. the distance is zero only from a point to itself, 
      3. the distance is the same in both directions, and 
      3. no distance is longer than a detour through a third point (the triangle inequality).
      
  undergraduate:
    text: |-
      Consider a set $X$ and a function $d : X \times X \to [0, \infty)$.
      The function $d$ is a _metric_ on $X$ if, for all $x, y, z \in X$,

      1. $d(x, y) = 0$ if and only if $x = y$,
      2. $d(x, y) = d(y, x)$ ([symmetry](/definitions/geometric-symmetry)), and
      3. $d(x, z) \leq d(x, y) + d(y, z)$ (the triangle inequality).

      The last condition is the _triangle inequality_.
      The set $X$ need not be a [vector](/definitions/vector) space.
---
In differential geometry, a "metric" (Riemannian metric) is an [inner product](/definitions/inner-product) on each [tangent space](/definitions/tangent-space), not a distance function, though it determines one.
In everyday language, a "metric" is any measurement or performance indicator.
