---
published: false
title: Linear combination
term: linear combination
applies_to: vectors
levels:
  high-school:
    text: |-
      Consider some vectors, such as $(1, 0)$ and $(0, 1)$.
      A _linear combination_ of the vectors is a vector that you get by multiplying each vector by a number and adding the results, such as $3 (1, 0) + 2 (0, 1) = (3, 2)$.
  undergraduate:
    context: vector spaces
    text: |-
      Consider vectors $v_1, \dots, v_n$ in a vector space $V$ over a field $\mathbb{F}$.
      A _linear combination_ of $v_1, \dots, v_n$ is a vector of the form

      $$c_1 v_1 + c_2 v_2 + \cdots + c_n v_n,$$

      where $c_1, \dots, c_n \in \mathbb{F}$ are scalars, called the _coefficients_.
properties:
  - >-
    The set of all linear combinations of $v_1, \dots, v_n$ is the [span](/dictionary/definitions/span) of $v_1, \dots, v_n$.
  - >-
    The vectors $v_1, \dots, v_n$ are [linearly independent](/dictionary/definitions/linearly-independent) exactly when the only linear combination equal to the [zero vector](/dictionary/definitions/zero-vector) has all coefficients equal to $0$.
  - >-
    A linear combination has finitely many terms, even in an infinite-dimensional vector space.
---
