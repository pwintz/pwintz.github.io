---
title: QR decomposition
term: QR decomposition
applies_to: matrices
synonyms: [QR factorization]
levels:
  undergraduate:
    text: |-
      Consider an $m \times n$ [matrix](/dictionary/definitions/matrix) $A$.
      A _QR decomposition_ of $A$ is a factorization $A = Q R$, where the columns of $Q$ are [orthonormal](/dictionary/definitions/orthonormal) and $R$ is upper triangular.
properties:
  - |-
    Every matrix has a QR decomposition.
    Applying the Gram–Schmidt process to the columns of $A$ produces one.
  - |-
    QR decompositions are used to solve least-squares problems and to compute [eigenvalues](/dictionary/definitions/eigenvalue) (the QR algorithm).
---
