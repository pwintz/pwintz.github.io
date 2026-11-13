---
published: false
title: Isolated point
term: isolated point
applies_to: sets
levels:
  high-school:
    text: |-
      Consider a set $S$ of numbers and a point $x$ of $S$.
      The point $x$ is an _isolated point_ of $S$ if there is a distance $r > 0$ such that $x$ is the only point of $S$ within distance $r$ of $x$.
  undergraduate:
    text: |-
      Consider a set $S$ in a [metric space](/dictionary/definitions/metric-space) and a point $x$ of $S$.
      The point $x$ is an _isolated point_ of $S$ if some [open ball](/dictionary/definitions/open-ball) around $x$ meets $S$ only at $x$:

      $$B(x, \varepsilon) \cap S = \setdef{x} \quad \text{for some } \varepsilon > 0.$$
  graduate:
    context: topological spaces
    text: |-
      Consider a set $S$ in a topological space and a point $x$ of $S$.
      The point $x$ is an _isolated point_ of $S$ if some [neighborhood](/dictionary/definitions/neighborhood) $U$ of $x$ meets $S$ only at $x$:

      $$U \cap S = \setdef{x}.$$
properties:
  - >-
    Every isolated point of $S$ belongs to $S$.
  - >-
    Each point of $S$ is either an isolated point of $S$ or a [limit point](/dictionary/definitions/limit-point) of $S$, but not both.
---
A set with no isolated points is called _dense-in-itself_, and a [closed set](/dictionary/definitions/closed-set) with no isolated points is called _perfect_.
