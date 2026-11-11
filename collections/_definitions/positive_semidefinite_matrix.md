---
title: Positive semidefinite matrix
term: positive semidefinite
applies_to: symmetric matrices
levels:
  undergraduate:
    text: |-
      A [symmetric](/dictionary/definitions/symmetric-matrix) $n \times n$ real [matrix](/dictionary/definitions/matrix) $A$ is _positive semidefinite_ if

      $$x^{\top} A x \geq 0 \quad \text{for every vector } x \in \reals^n.$$
properties:
  - >-
    A [symmetric matrix](/dictionary/definitions/symmetric-matrix) is positive semidefinite if and only if all of its [eigenvalues](/dictionary/definitions/eigenvalue) are nonnegative.
  - >-
    Every matrix of the form $B^{\top} B$ is positive semidefinite, because $x^{\top} B^{\top} B x = \norm{B x}^2 \geq 0$.
    Conversely, every positive semidefinite matrix can be written in this form.
  - >-
    A positive semidefinite matrix is [positive definite](/dictionary/definitions/positive-definite-matrix) if and only if it is [invertible](/dictionary/definitions/invertible-matrix).
  - >-
    Sylvester's criterion with $\geq$ does not test positive semidefiniteness: all leading principal minors of $$\begin{bmatrix} 0 & 0 \\ 0 & -1 \end{bmatrix}$$ are $\geq 0$, but $x = (0, 1)$ gives $x^{\top} A x = -1$.
    All principal minors (not only the leading ones) must be nonnegative.
---
Writing $A \succeq 0$ means that $A$ is positive semidefinite, and $A \succ 0$ means that $A$ is positive definite.
