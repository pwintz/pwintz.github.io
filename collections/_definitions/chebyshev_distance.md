---
title: Chebyshev distance
term: Chebyshev distance
applies_to: points
synonyms: [chessboard distance, maximum metric, '$d_{\infty}(p, q)$']
levels:
  high-school:
    text: |-
      Consider two points $p = (p_1, \dots, p_n)$ and $q = (q_1, \dots, q_n)$ in $\reals^n$.
      The _Chebyshev distance_ between $p$ and $q$ is the largest difference in any one coordinate:

      $$d_{\infty}(p, q) = \max_i \abs{p_i - q_i}.$$
properties:
  - >-
    The Chebyshev distance is $\norm{p - q}_{\infty}$, the [infinity norm](/definitions/infinity-norm) of the difference.
  - >-
    On a chessboard, the Chebyshev distance between two squares is the number of moves a king needs to go from one to the other.
---
