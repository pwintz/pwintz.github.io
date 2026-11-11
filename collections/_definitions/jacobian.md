---
title: Jacobian matrix
term: Jacobian
applies_to: vector-valued functions
synonyms: [$Df(x)$, "$\\frac{\\partial f}{\\partial x}$"]
levels:
  high-school:
    text: |-
      The _Jacobian_ of a function with several inputs and several outputs is the table of all of its [partial derivatives](/dictionary/definitions/partial-derivative), with one row per output and one column per input.
  undergraduate:
    text: |-
      The _Jacobian_ of $f : \reals^n \to \reals^m$ is the $m \times n$ [matrix](/dictionary/definitions/matrix) of [partial derivatives](/dictionary/definitions/partial-derivative), whose entry in row $i$ and column $j$ is $\frac{\partial f_i}{\partial x_j}$.
properties:
  - >-
    The Jacobian is the [matrix](/dictionary/definitions/matrix) of the derivative $Df(x)$ in the standard bases.
  - >-
    For $m = 1$, the Jacobian is a row [vector](/dictionary/definitions/vector), the transpose of the [gradient](/dictionary/definitions/gradient).
  - >-
    Chain rule: the Jacobian of $g \circ f$ at $x$ is the product of the Jacobian of $g$ at $f(x)$ and the Jacobian of $f$ at $x$.
---
"Jacobian" sometimes means the [Jacobian determinant](/dictionary/definitions/jacobian-determinant) (when $m = n$), as in the change-of-variables formula. See [Jacobian: matrix vs. determinant](/dictionary/distinctions/meanings-of-jacobian).
