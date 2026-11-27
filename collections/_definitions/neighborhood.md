---
title: Neighborhood (Containing an Open Set)
term: neighborhood
applies_to: points
levels:
  high-school:
    context: real numbers
    text: |-
      Consider a real number $x$.
      A _neighborhood_ of $x$ is a set of real numbers that contains an [open neighborhood](/dictionary/definitions/open-neighborhood) of $x$.
  undergraduate:
    context: '$\reals^n$'
    text: |-
      Consider a point $\vect{x}$ in $\reals^n$.
      A _neighborhood_ of $\vect{x}$ is a set $N \subseteq \reals^n$ such that, for some number $\varepsilon > 0$, the set $N$ contains the [open ball](/dictionary/definitions/open-ball) of radius $\varepsilon$ centered at $\vect{x}$:

      $$\setdef{\vect{y} \in \reals^n \suchthat \norm{\vect{y} - \vect{x}} < \varepsilon} \subseteq N.$$
    figure:
      widget: neighborhood
      params: { point: '\vect{x}' }
      caption: |-
        The set $N$ includes its boundary (solid line), so $N$ is not open.
        Drag $\vect{x}$ to see an open ball around $\vect{x}$ that lies inside $N$.
        On the boundary of $N$, every open ball around $\vect{x}$ reaches outside $N$.
      alt: A shaded set N in the plane with a solid boundary, a point x (a vector) that can be dragged, and an open ball around x.
  graduate:
    context: metric and topological spaces
    text: |-
      Consider a point $x$ in a [metric space](/dictionary/definitions/metric-space) or [topological space](/dictionary/definitions/topological-space).
      A _neighborhood_ of $x$ is a set $N$ that contains an [open set](/dictionary/definitions/open-set) $U$ such that $x \in U$.
properties:
  - |-
    In a [metric space](/dictionary/definitions/metric-space), $N$ is a neighborhood of $x$ if and only if $N$ contains an [open ball](/dictionary/definitions/open-ball) $B(x, \varepsilon)$ for some $\varepsilon > 0$.
  - |-
    A set is open if and only if it is a neighborhood of each of its points.
---
Some authors require a neighborhood to be open, so that "neighborhood" means [open neighborhood](/dictionary/definitions/open-neighborhood).
