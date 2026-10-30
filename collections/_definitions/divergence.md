---
published: false
title: Divergence
term: divergence
applies_to: vector fields
synonyms: [$\nabla \cdot F$, "$\\operatorname{div} F$"]
levels:
  high-school:
    text: |-
      The _divergence_ of a flow measures how much it spreads out from each point (positive) or gathers in toward it (negative).
  undergraduate:
    text: |-
      The _divergence_ of a [vector](/definitions/vector) field $F : \reals^n \to \reals^n$ is the scalar function

      $$\nabla \cdot F = \frac{\partial F_1}{\partial x_1} + \dots + \frac{\partial F_n}{\partial x_n}.$$

      It measures how much $F$ spreads out from a point.
properties:
  - >-
    The divergence is the trace of the [Jacobian](/definitions/jacobian) [matrix](/definitions/matrix) of $F$.
  - >-
    By the divergence theorem, the integral of $\nabla \cdot F$ over a region equals the flux of $F$ out through its [boundary](/definitions/boundary).
---
Unrelated to a [divergent](/definitions/divergent) [sequence](/definitions/sequence).
