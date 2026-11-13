---
title: Vector space
term: vector space
applies_to: algebraic structures
synonyms: [linear space]
levels:
  high-school:
    text: |-
      A _vector space_ is a set of objects, called [vectors](/dictionary/definitions/vector), that can be added to each other and multiplied by numbers, called scalars, following the usual rules of arithmetic, such as $u + v = v + u$ and $2 (u + v) = 2 u + 2 v$.
  undergraduate:
    text: |-
      A _vector space_ over a [field](/dictionary/definitions/field) $F$ is a set $V$ with a vector addition $V \times V \to V$ and a scalar multiplication $F \times V \to V$ such that, for all $a, b \in F$ and $u, v \in V$,

      1. $V$ with addition is a [commutative](/dictionary/definitions/commutative) [group](/dictionary/definitions/group),
      2. Scalar multiplication is distributive over addition: $a (u + v) = a u + a v$ and $(a + b) v = a v + b v$,
      3. $(a b) v = a (b v)$, and
      4. $1 v = v$.

      The elements of $V$ are called _vectors_, and the elements of $F$ are called _scalars_.
properties:
  - >-
    Every vector space has a [basis](/dictionary/definitions/vector-basis), assuming the axiom of choice, and all bases of the same vector space have the same number of elements, which is the [dimension](/dictionary/definitions/dimension-vector-space) of the vector space.
  - >-
    In a vector space, multiplication of two vectors is undefined, but can be introduced as in an [algebra](/dictionary/definitions/algebra-over-a-field) or an [inner product space](/dictionary/definitions/inner-product-space).
---
A real vector space is a vector space over $\reals$, and a complex vector space is a vector space over $\mathbb{C}$.
