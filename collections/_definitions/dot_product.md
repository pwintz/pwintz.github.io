---
title: Dot product
term: dot product
applies_to: vectors in $\reals^n$
synonyms: [scalar product, $x \cdot y$]
levels:
  high-school:
    text: |-
      Consider two [vectors](/definitions/vector) $x = (x_1, \dots, x_n)$ and $y = (y_1, \dots, y_n)$ in $\reals^n$.
      The _dot product_ of $x$ and $y$ is

      $$x \cdot y = x_1 y_1 + x_2 y_2 + \dots + x_n y_n.$$
  undergraduate:
    text: |-
      Consider the vector space $\reals^n$, with vectors written as columns.
      The _dot product_ is the standard [inner product](/definitions/inner-product) on $\reals^n$,

      $$x \cdot y = x^{\top} y.$$
properties:
  - >-
    $x \cdot y = \norm{x} \norm{y} \cos \theta$, where $\theta$ is the angle between $x$ and $y$.
    In particular, $x \cdot y = 0$ exactly when $x$ and $y$ are perpendicular (or one of them is zero).
---
