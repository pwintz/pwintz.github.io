---
title: Euclidean norm
term: Euclidean norm
applies_to: vectors in $\reals^n$
synonyms: ['$\norm{x}_2$', 2-norm, $\ell^2$ norm, length]
levels:
  high-school:
    text: |-
      Consider a [vector](/definitions/vector) $x = (x_1, \dots, x_n)$, drawn as an arrow from the origin.
      The _Euclidean norm_ of $x$ is the length of the arrow:

      $$\norm{x}_2 = \sqrt{x_1^2 + \dots + x_n^2}.$$
properties:
  - >-
    The Euclidean norm comes from the [dot product](/definitions/dot-product), as $\norm{x}_2 = \sqrt{x \cdot x}$, so it is the only one of the common [norms](/definitions/norm) on $\reals^n$ that measures angles as well as lengths.
  - >-
    Rotations and reflections do not change the Euclidean norm of a vector.
---
When no [norm](/definitions/norm) is specified, $\norm{x}$ on $\reals^n$ usually means the Euclidean norm.
