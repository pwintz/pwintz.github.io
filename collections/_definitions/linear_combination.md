---
title: Linear Combination
term: linear combination
applies_to: vectors
levels:
  high-school:
    text: |-
      Consider some [vectors](/dictionary/definitions/vector), such as $(1, 0)$ and $(0, 1)$.
      A _linear combination_ of the vectors is a vector that you get by multiplying each vector by a number and adding the results, such as $3 (1, 0) + 2 (0, 1) = (3, 2)$.
  undergraduate:
    context: vector spaces
    text: |-
      Consider [vectors](/dictionary/definitions/vector) $\vect{v}_1, \dots, \vect{v}_n$ in a [vector space](/dictionary/definitions/vector-space) $V$ over a [field](/dictionary/definitions/field) $\mathbb{F}$.
      A _linear combination_ of $\vect{v}_1, \dots, \vect{v}_n$ is a vector of the form

      $$c_1 \vect{v}_1 + c_2 \vect{v}_2 + \cdots + c_n \vect{v}_n,$$

      where $c_1, \dots, c_n \in \mathbb{F}$ are scalars, called the _coefficients_.
properties:
  - |-
    The set of all linear combinations of $\vect{v}_1, \dots, \vect{v}_n$ is the [span](/dictionary/definitions/span) of $\vect{v}_1, \dots, \vect{v}_n$.
  - |-
    The vectors $\vect{v}_1, \dots, \vect{v}_n$ are [linearly independent](/dictionary/definitions/linearly-independent) exactly when the only linear combination equal to the [zero vector](/dictionary/definitions/zero-vector) has all coefficients equal to $0$.
  - |-
    A linear combination must have finitely many terms, even in an infinite-dimensional [vector space](/dictionary/definitions/vector-space).
---
