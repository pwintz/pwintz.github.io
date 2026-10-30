---
published: false
title: Norm
term: norm
applies_to: vector spaces
synonyms: [$\lVert x \rVert$, length, magnitude]
levels:
  elementary:
    text: |-
      The _norm_ of a [vector](/definitions/vector) is its length: how long the arrow is.
  high-school:
    text: |-
      The _norm_ of a [vector](/definitions/vector) is its length: $\lVert x \rVert = \sqrt{x_1^2 + \dots + x_n^2}$.
    caveat: >-
      This is the Euclidean norm, which is only one of many norms. Others include $\lvert x_1 \rvert + \dots + \lvert x_n \rvert$ and $\max_i \lvert x_i \rvert$.
  undergraduate:
    text: |-
      A _norm_ on a [vector](/definitions/vector) space $V$ is a function $\lVert \cdot \rVert : V \to [0, \infty)$ with $\lVert x \rVert = 0$ only for $x = 0$, $\lVert c x \rVert = \lvert c \rvert \lVert x \rVert$, and $\lVert x + y \rVert \leq \lVert x \rVert + \lVert y \rVert$ (the triangle inequality).
properties:
  - >-
    Every norm satisfies $\lvert \lVert x \rVert - \lVert y \rVert \rvert \leq \lVert x - y \rVert$, so it is a [continuous](/definitions/continuous) function.
  - >-
    On a finite-dimensional space, all norms are equivalent: they give the same open sets and the same convergent [sequences](/definitions/sequence).
---
