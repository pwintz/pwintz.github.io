---
title: Chart (Manifold)
term: chart
applies_to: manifolds
synonyms: [coordinate chart, local coordinates]
levels:
  undergraduate:
    text: |-
      Consider a [manifold](/dictionary/definitions/manifold) $M$ of [dimension](/dictionary/definitions/dimension-manifold) $n$.
      A _chart_ on $M$ is a region $U$ of $M$ together with a rule $\varphi$ that assigns $n$ coordinates $\varphi(p)$ to each point $p$ in $U$, such that $\varphi$ flattens $U$ onto an open region of $\reals^n$ without tearing or gluing (the map is [continuous with a continuous inverse](/dictionary/definitions/homeomorphism)).

      A chart is like a page in a world atlas that shows a map of a region of the Earth. 
      Each chart renders a curved portion of the Earth's surface ($M$) on a flat page ($U \subset \reals^2$).
  graduate:
    context: differential geometry
    text: |-
      Consider a [manifold](/dictionary/definitions/manifold) $M$ of [dimension](/dictionary/definitions/dimension-manifold) $n$.
      A _chart_ on $M$ is a pair $(U, \varphi)$ such that $U$ is an open [subset](/dictionary/definitions/subset) of $M$ and $\varphi$ is a [homeomorphism](/dictionary/definitions/homeomorphism)

      $$\varphi : U \to \varphi(U) \subseteq \reals^n$$

      onto an open subset $\varphi(U)$ of $\reals^n$.
      The set $U$ is the _domain_ of the chart, and $\varphi$ is the [chart map](/dictionary/definitions/chart-map).
properties:
  - |-
    For each point $p$ in $U$, the chart defines the coordinates $\varphi(p)$, so each chart is a [coordinate system](/dictionary/definitions/coordinate-system) on $U$.
  - |-
    The [sphere](/dictionary/definitions/sphere) has no chart whose domain is the whole sphere, so an [atlas](/dictionary/definitions/atlas) of the sphere needs at least two charts.
---
A chart on a [manifold](/dictionary/definitions/manifold) is unrelated to a [chart](/dictionary/definitions/chart) that presents data.
