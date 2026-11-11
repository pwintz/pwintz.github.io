---
title: Taxicab distance
term: Taxicab distance
applies_to: points
synonyms: [Manhattan distance, '$\ell^1$ distance', '$d_1(p, q)$']
levels:
  high-school:
    text: |-
      Consider two points $p = (p_1, \dots, p_n)$ and $q = (q_1, \dots, q_n)$ in $\reals^n$.
      The _taxicab distance_ between $p$ and $q$ is the distance traveled from $p$ to $q$ when moving parallel to one axis at a time, as along the streets of a grid:

      $$d_1(p, q) = \abs{p_1 - q_1} + \dots + \abs{p_n - q_n}.$$
  undergraduate:
    text: |-
      Consider two points $p = (p_1, \dots, p_n)$ and $q = (q_1, \dots, q_n)$ in $\reals^n$.
      The _taxicab distance_ between $p$ and $q$ is defined as

      $$d_1(p, q) = \sum_{i=1}^n \abs{p_i - q_i}.$$
properties:
  - >-
    The taxicab distance is $\norm{p - q}_1$, the [1-norm](/dictionary/definitions/one-norm) of the difference.
---
