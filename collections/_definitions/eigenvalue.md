---
title: Eigenvalue
term: eigenvalue
applies_to: square matrices and linear maps
levels:
  high-school:
    text: |-
      Consider a square [matrix](/dictionary/definitions/matrix) $A$, which stretches and turns [vectors](/dictionary/definitions/vector) when it multiplies them.
      An _eigenvalue_ of $A$ is a number $\lambda$ such that $A$ stretches some nonzero vector $v$ by the factor $\lambda$ without turning it off its line:

      $$A v = \lambda v.$$
    caveat: >-
      An eigenvalue can be a complex number, with a complex [eigenvector](/dictionary/definitions/eigenvector).
      Then the picture of stretching without turning does not apply in the real plane: for example, the matrix that rotates the plane by $90°$ turns every real vector off its line, but it has the complex eigenvalues $i$ and $-i$.
  undergraduate:
    text: |-
      Consider a square [matrix](/dictionary/definitions/matrix) $A$.
      An _eigenvalue_ of $A$ is a number $\lambda$ such that

      $$A v = \lambda v$$

      for some nonzero [vector](/dictionary/definitions/vector) $v$, called an [_eigenvector_](/dictionary/definitions/eigenvector).
properties:
  - >-
    The eigenvalues of $A$ are the roots of its characteristic [polynomial](/dictionary/definitions/polynomial) $\det(\lambda I - A)$.
  - >-
    The origin of $\dot{x} = A x$ is [asymptotically stable](/dictionary/definitions/asymptotically-stable) if and only if every eigenvalue of $A$ has negative real part ($A$ is Hurwitz).
---
