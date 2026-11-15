---
title: Homeomorphism
term: homeomorphism
applies_to: topological spaces
levels:
  high-school:
    context: topological spaces
    text: |-
      Consider a function $f : \reals \to \reals$. 
      We say that $f$ is _homeomorphism_ if 
      
      1. $f$ is [invertible](/dictionary/definitions/bijective) (meaning it is [one-to-one](/dictionary/definitions/injective) and [onto](/dictionary/definitions/surjective)),
      2. $f$ is [continuous](/dictionary/definitions/continuous), and
      3. $f^{-1}$ (the [inverse](/dictionary/definitions/inverse-element) of $f$) is continuous 
  undergraduate:
    context: topological spaces
    text: |-
      Consider topological spaces $X$ and $Y$.
      A _homeomorphism_ from $X$ to $Y$ is a [bijective](/dictionary/definitions/bijective) function $f : X \to Y$ such that $f$ and $f^{-1}$ are both [continuous](/dictionary/definitions/continuous).
properties:
  - >-
    Spaces related by a homeomorphism are called _homeomorphic_, and they have the same topological properties, such as [compactness](/dictionary/definitions/compact) and [connectedness](/dictionary/definitions/connected).
  - >-
    A [continuous](/dictionary/definitions/continuous) bijection need not be a homeomorphism: $t \mapsto (\cos t, \sin t)$ from $[0, 2\pi)$ to the unit [circle](/dictionary/definitions/circle) is a continuous bijection, but its inverse is not continuous at $(1, 0)$.
---
<!-- The popular saying that "a coffee cup is a donut" means that their surfaces are homeomorphic. -->
