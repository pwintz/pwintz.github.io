---
title: Field (algebra)
term: field
applies_to: algebraic structures
levels:
  high-school:
    text: |-
      A _field_ is a set of numbers (or other objects) that can be added, subtracted, multiplied, and divided by every nonzero element, following the same rules as the arithmetic of real numbers.
  undergraduate:
    context: abstract algebra
    text: |-
      Consider a set $F$ with two [binary operations](/dictionary/definitions/binary-operation), addition $+$ and multiplication $\cdot$.
      The set $F$ is a _field_ if

      1. $F$ is a [ring](/dictionary/definitions/ring) with $+$ and $\cdot$,
      2. multiplication is [commutative](/dictionary/definitions/commutative),
      3. There exists an additive identity $0$ and a multiplicative identity $1$ such that $0 \neq 1$, and
      4. every element $a \neq 0$ has a multiplicative [inverse](/dictionary/definitions/inverse-element) $a^{-1}$ such that $a a^{-1} = 1$.
properties:
  - >-
    A field has no zero divisors: if $a b = 0$, then $a = 0$ or $b = 0$.
  - >-
    The [integers](/dictionary/definitions/integer) modulo $n$ form a field if and only if $n$ is prime.
  - >-
    The scalars of a [vector space](/dictionary/definitions/vector-space) come from a field.
---
This "field" is unrelated to a [vector field](/dictionary/definitions/vector-field) or to a scalar field in physics, which are functions that assign a vector or a number to each point of space.
