---
title: Curl
term: curl
applies_to: vector fields on $\reals^3$
synonyms: [$\nabla \times F$, "$\\operatorname{curl} F$"]
levels:
  high-school:
    text: |-
      Consider a flow, like water moving in a pond, and imagine placing a tiny paddle wheel at a point in it.
      The _curl_ of the flow at that point measures how much the flow swirls around the point: how fast the paddle wheel would spin.
  undergraduate:
    text: |-
      Consider a [vector field](/dictionary/definitions/vector-field) $F = (F_1, F_2, F_3) : \reals^3 \to \reals^3$.
      The _curl_ of $F$ is the vector field

      $$\nabla \times F = \left( \frac{\partial F_3}{\partial y} - \frac{\partial F_2}{\partial z}, \frac{\partial F_1}{\partial z} - \frac{\partial F_3}{\partial x}, \frac{\partial F_2}{\partial x} - \frac{\partial F_1}{\partial y} \right).$$

      It measures the rotation of $F$ around each point.
---
