---
title: Divergence
term: divergence
applies_to: vector fields
synonyms: [$\nabla \cdot F$, "$\\operatorname{div} F$"]
levels:
  high-school:
    text: |-
      Consider a flow, like air moving in a room.
      The _divergence_ of the flow measures how much it spreads out from each point (positive) or gathers in toward it (negative).
  undergraduate:
    text: |-
      Consider a [vector field](/dictionary/definitions/vector-field) $F = (F_1, \dots, F_n) : \reals^n \to \reals^n$.
      The _divergence_ of $F$ is the scalar function

      $$\nabla \cdot F = \frac{\partial F_1}{\partial x_1} + \dots + \frac{\partial F_n}{\partial x_n}.$$

      It measures how much $F$ spreads out from a point.
properties:
  - >-
    The divergence is the trace of the [Jacobian](/dictionary/definitions/jacobian) [matrix](/dictionary/definitions/matrix) of $F$.
  - >-
    By the divergence theorem, the integral of $\nabla \cdot F$ over a region equals the flux of $F$ out through its [boundary](/dictionary/definitions/boundary).
---
Unrelated to a [divergent](/dictionary/definitions/divergent) [sequence](/dictionary/definitions/sequence).
