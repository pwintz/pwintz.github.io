---
title: Jordan–Chevalley decomposition
term: Jordan–Chevalley decomposition
applies_to: square matrices and linear maps
synonyms: [additive Jordan decomposition, SN decomposition]
levels:
  undergraduate:
    context: complex matrices
    text: |-
      The _Jordan–Chevalley decomposition_ of a square [matrix](/dictionary/definitions/matrix) $A$ writes it as a sum $A = D + N$, where $D$ is diagonalizable, $N$ is nilpotent ($N^k = 0$ for some $k$), and $D N = N D$.
  graduate:
    context: linear maps over a perfect field
    text: |-
      The _Jordan–Chevalley decomposition_ of a [linear map](/dictionary/definitions/linear-map) $T$ on a finite-dimensional vector space writes it as $T = S + N$, where $S$ is semisimple, $N$ is nilpotent, and $S$ and $N$ commute.
properties:
  - |-
    The decomposition exists and is unique. Both $D$ and $N$ are [polynomials](/dictionary/definitions/polynomial) in $A$.
  - |-
    In a [Jordan normal form](/dictionary/definitions/jordan-normal-form), $D$ is the diagonal part and $N$ is the part above the diagonal.
---
Unlike the LU, QR, and [singular value decompositions](/dictionary/definitions/singular-value-decomposition), the Jordan–Chevalley decomposition is a sum, not a product.
