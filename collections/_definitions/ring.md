---
title: Ring
term: ring
applies_to: algebraic structures
levels:

  high-school:
  text: |-
    A _ring_ is a set of objects that can be added, subtracted, and multiplied, following the same algebraic rules as integer addition, subtraction, and multiplication (but not division).
  undergraduate:
    context: abstract algebra
    text: |-
      Consider a set $R$ with two [binary operations](/dictionary/definitions/binary-operation), addition $+$ and multiplication $\cdot$.
      The set $R$ is a _ring_ if

      1. $R$ with $+$ is a [commutative](/dictionary/definitions/commutative) [group](/dictionary/definitions/group), whose [identity element](/dictionary/definitions/identity-element) is written $0$,
      2. multiplication is [associative](/dictionary/definitions/associative) and has an identity element, written $1$, and
      3. multiplication distributes over addition: $a (b + c) = a b + a c$ and $(a + b) c = a c + b c$ for all $a, b, c \in R$.
properties:
  - >-
    Multiplication in a ring need not be [commutative](/dictionary/definitions/commutative).
    A ring whose multiplication is commutative is called a _commutative ring_.
  - >-
    Elements of a ring need not have multiplicative inverses, so division need not be possible.
  - >-
    In every ring, $0 \cdot a = a \cdot 0 = 0$ and $(-1) \cdot a = -a$ for all $a$.
---
Some authors do not require a multiplicative identity $1$.
Those authors call a ring with $1$ a _unital ring_, and some call a ring without $1$ a _rng_.
Under that convention, the even [integers](/dictionary/definitions/integer) form a ring; under the convention used here, they do not, because $1$ is not even.
