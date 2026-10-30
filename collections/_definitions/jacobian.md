---
published: false
title: Jacobian matrix
term: Jacobian
applies_to: vector-valued functions
synonyms: [$Df(x)$, "$\\frac{\\partial f}{\\partial x}$"]
levels:
  high-school:
    text: |-
      The _Jacobian_ of a function with several inputs and several outputs is the table of all of its [partial derivatives](/definitions/partial-derivative), with one row per output and one column per input.
  undergraduate:
    text: |-
      The _Jacobian_ of $f : \reals^n \to \reals^m$ is the $m \times n$ [matrix](/definitions/matrix) of [partial derivatives](/definitions/partial-derivative), whose entry in row $i$ and column $j$ is $\frac{\partial f_i}{\partial x_j}$.
properties:
  - >-
    The Jacobian is the [matrix](/definitions/matrix) of the derivative $Df(x)$ in the standard bases.
  - >-
    For $m = 1$, the Jacobian is a row [vector](/definitions/vector), the transpose of the [gradient](/definitions/gradient).
  - >-
    Chain rule: the Jacobian of $g \circ f$ at $x$ is the product of the Jacobian of $g$ at $f(x)$ and the Jacobian of $f$ at $x$.
---
"Jacobian" sometimes means the determinant of the Jacobian [matrix](/definitions/matrix) (when $m = n$), as in the change-of-variables formula.
