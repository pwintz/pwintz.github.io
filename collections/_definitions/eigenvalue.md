---
published: false
title: Eigenvalue
term: eigenvalue
applies_to: square matrices and linear maps
levels:
  high-school:
    text: |-
      Consider a square [matrix](/definitions/matrix) $A$, which stretches and turns [vectors](/definitions/vector) when it multiplies them.
      An _eigenvalue_ of $A$ is a number $\lambda$ such that $A$ stretches some nonzero vector $v$ by the factor $\lambda$ without turning it off its line: $A v = \lambda v$.
  undergraduate:
    text: |-
      Consider a square [matrix](/definitions/matrix) $A$.
      An _eigenvalue_ of $A$ is a number $\lambda$ such that $A v = \lambda v$ for some nonzero [vector](/definitions/vector) $v$, called an _eigenvector_.
properties:
  - >-
    The eigenvalues of $A$ are the roots of its characteristic polynomial $\det(\lambda I - A)$.
  - >-
    The origin of $\dot{x} = A x$ is [asymptotically stable](/definitions/asymptotically-stable) if and only if every eigenvalue of $A$ has negative real part ($A$ is Hurwitz).
---
