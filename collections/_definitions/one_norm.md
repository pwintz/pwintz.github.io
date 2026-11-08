---
title: 1-norm
term: 1-norm
applies_to: vectors in $\reals^n$
synonyms: ['$\norm{x}_1$', taxicab norm, Manhattan norm, $\ell^1$ norm]
levels:
  high-school:
    text: |-
      Consider a [vector](/definitions/vector) $x = (x_1, \dots, x_n)$.
      The _1-norm_ of $x$ is the sum of the absolute values of its entries:

      $$\norm{x}_1 = \abs{x_1} + \dots + \abs{x_n}.$$
properties:
  - >-
    In the plane, $\norm{x - y}_1$ is the distance from $y$ to $x$ when traveling only along horizontal and vertical streets, as in a city grid. The is why the 1-norm is sometimes called the _taxicab norm_ or _Manhattan norm_.
  - >-
    For every $x \in \reals^n$, $\norm{x}_{\infty} \leq \norm{x}_2 \leq \norm{x}_1$.
---
