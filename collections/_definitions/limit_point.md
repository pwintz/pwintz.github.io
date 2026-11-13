---
published: false
title: Limit point of a set
term: limit point
applies_to: sets
synonyms: [point of accumulation, accumulation point, cluster point]
levels:
  high-school:
    text: |-
      Consider a set $S$ and a point $x$.
      The point $x$ is a _limit point_ of $S$ if there are points of $S$, other than $x$ itself, as close to $x$ as you like.
  undergraduate:
    text: |-
      Consider a set $S$ in a [metric space](/dictionary/definitions/metric-space) and a point $x$.
      The point $x$ is a _limit point_ of $S$ if every [open ball](/dictionary/definitions/open-ball) around $x$ contains a point of $S$ other than $x$:

      $$B(x, \varepsilon) \cap (S \setminus \setdef{x}) \neq \emptyset \quad \text{for every } \varepsilon > 0.$$
  graduate:
    context: topological spaces
    text: |-
      Consider a set $S$ in a topological space and a point $x$.
      The point $x$ is a _limit point_ of $S$ if every [neighborhood](/dictionary/definitions/neighborhood) $U$ of $x$ contains a point of $S$ other than $x$:

      $$U \cap (S \setminus \setdef{x}) \neq \emptyset.$$
properties:
  - >-
    A limit point of $S$ need not belong to $S$.
    A set is [closed](/dictionary/definitions/closed-set) if and only if it contains all of its limit points.
  - >-
    The [closure](/dictionary/definitions/closure) of $S$ is the [union](/dictionary/definitions/set-union) of $S$ and its set of limit points, which is often written $S^{\prime}$.
  - >-
    In a [metric space](/dictionary/definitions/metric-space), $x$ is a limit point of $S$ if and only if some sequence of points of $S \setminus \setdef{x}$ converges to $x$, and then every [open ball](/dictionary/definitions/open-ball) around $x$ contains infinitely many points of $S$.
  - >-
    Every [bounded](/dictionary/definitions/bounded) infinite [subset](/dictionary/definitions/subset) of $\reals^n$ has a limit point (the Bolzano–Weierstrass theorem).
---
For [sequences](/dictionary/definitions/sequence), "limit point" sometimes means a subsequential limit, which is different.
The sequence $1, 1, 1, \dots$ has the subsequential limit $1$, but its set of values $\setdef{1}$ has no limit points.
