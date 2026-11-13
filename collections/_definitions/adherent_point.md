---
published: false
title: Adherent point
term: adherent point
applies_to: sets
synonyms: [closure point, point of closure, contact point]
levels:
  high-school:
    text: |-
      Consider a set $S$ of numbers and a point $x$, which may or may not be in $S$.
      The point $x$ is an _adherent point_ of $S$ if there are points of $S$ as close to $x$ as you like, where $x$ itself counts if $x$ is in $S$.
  undergraduate:
    text: |-
      Consider a set $S$ in a [metric space](/dictionary/definitions/metric-space) and a point $x$.
      The point $x$ is an _adherent point_ of $S$ if every [open ball](/dictionary/definitions/open-ball) around $x$ contains a point of $S$:

      $$B(x, \varepsilon) \cap S \neq \emptyset \quad \text{for every } \varepsilon > 0.$$
  graduate:
    context: topological spaces
    text: |-
      Consider a set $S$ in a topological space and a point $x$.
      The point $x$ is an _adherent point_ of $S$ if every [neighborhood](/dictionary/definitions/neighborhood) $U$ of $x$ contains a point of $S$:

      $$U \cap S \neq \emptyset.$$
properties:
  - >-
    The [closure](/dictionary/definitions/closure) of $S$ is the set of adherent points of $S$.
  - >-
    Every point of $S$ is an adherent point of $S$.
  - >-
    The adherent points of $S$ are the [limit points](/dictionary/definitions/limit-point) of $S$ together with the [isolated points](/dictionary/definitions/isolated-point) of $S$.
  - >-
    In a [metric space](/dictionary/definitions/metric-space), $x$ is an adherent point of $S$ if and only if some sequence of points of $S$ converges to $x$.
---
