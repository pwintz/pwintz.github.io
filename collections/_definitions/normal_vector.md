---
title: Normal vector
term: normal vector
applies_to: curves and surfaces
synonyms: [normal line, normal to]
levels:
  high-school:
    text: |-
      Consider a point on a curve.
      A _normal vector_ at the point is a vector that is [perpendicular](/dictionary/definitions/perpendicular) to the curve at that point. 
      More precisely, a vector $v$ is normal to a curve at $P$ if the line [spanned](/dictionary/definitions/span) by $v$ from $P$ is perpendicular to the [tangent](/dictionary/definitions/tangent) line of the curve at $P$.
  undergraduate:
    context: differential geometry
    text: |-
      Consider a smooth surface $S$ in $\reals^n$ and a point $p \in S$.
      A vector $n$ is called a _normal vector_ to $S$ at $p$ if $n$ is [orthogonal](/dictionary/definitions/orthogonal-vectors) to every tangent vector of $S$ at $p$:

      $$\ip{n}{v} = 0 \quad \text{for every tangent vector } v \text{ of } S \text{ at } p.$$
properties:
  - >-
    For a level set $\setdef{x \suchthat f(x) = c}$, the [gradient](/dictionary/definitions/gradient) $\nabla f(p)$, if nonzero, is a normal vector at $p$.
  - >-
    The _normal line_ at $p$ is the line through $p$ in the direction of a normal vector.
  - >-
    "Normal" means "perpendicular" here, and the word is unrelated to the [normal distribution](/dictionary/definitions/normal-distribution) and to a [normal space](/dictionary/definitions/normal-space).
---
