---
title: Algebra over a field
term: algebra (over a field)
applies_to: algebraic structures
levels:
  undergraduate:
    context: abstract algebra
    text: |-
      An _algebra_ over a [field](/dictionary/definitions/field) $F$ is a [vector space](/dictionary/definitions/vector-space) $A$ over $F$ with a multiplication $A \times A \to A$, written $u v$, that is bilinear. 
      
      That is, for all $a \in F$ and $u, v, w \in A$,

      1. $(u + v) w = u w + v w$,
      2. $u (v + w) = u v + u w$, and
      3. $(a u) v = a (u v) = u (a v)$.
properties:
  - >-
    The multiplication of an algebra need not be [associative](/dictionary/definitions/associative) or [commutative](/dictionary/definitions/commutative).
    A [Lie algebra](/dictionary/definitions/lie-algebra), whose multiplication is the [Lie bracket](/dictionary/definitions/lie-bracket), is neither.
  - >-
    An algebra whose multiplication is [associative](/dictionary/definitions/associative) and has an [identity element](/dictionary/definitions/identity-element) is a [ring](/dictionary/definitions/ring), and the scalar multiplication of that algebra satisfies $a u = (a 1) u$.
  - >-
    Every algebra over $F$ is a [module](/dictionary/definitions/module) over $F$, because every algebra over $F$ is a [vector space](/dictionary/definitions/vector-space) over $F$.
---
Many authors require an algebra to be [associative](/dictionary/definitions/associative) and to have an [identity element](/dictionary/definitions/identity-element) $1$ (to be _unital_).
Others, as here, also allow nonassociative algebras, such as Lie algebras.
An _algebra over a ring_ $R$ is defined the same way, with a [module](/dictionary/definitions/module) over $R$ in place of the [vector space](/dictionary/definitions/vector-space).

The word "algebra" has several other meanings: the branch of mathematics, a [σ-algebra](/dictionary/definitions/sigma-algebra) of sets, and, in universal algebra, every set with a collection of operations.
