---
title: Module (algebra)
term: module
applies_to: algebraic structures
levels:
  undergraduate:
    context: abstract algebra
    text: |-
      A _module_ over a [ring](/dictionary/definitions/ring) $R$ is a set $M$ with an addition $M \times M \to M$ and a scalar multiplication $R \times M \to M$ such that, for all $r, s \in R$ and $x, y \in M$,

      1. $M$ with addition is a [commutative](/dictionary/definitions/commutative) [group](/dictionary/definitions/group),
      2. $r (x + y) = r x + r y$ and $(r + s) x = r x + s x$,
      3. $(r s) x = r (s x)$, and
      4. $1 x = x$.

      A module is defined like a [vector space](/dictionary/definitions/vector-space), except that the scalars come from a ring instead of a [field](/dictionary/definitions/field).
properties:
  - >-
    A module over a [field](/dictionary/definitions/field) is the same as a [vector space](/dictionary/definitions/vector-space) over that field.
  - >-
    Every [commutative](/dictionary/definitions/commutative) [group](/dictionary/definitions/group) $M$ is a module over the [integers](/dictionary/definitions/integer), with $n x = x + \dots + x$ ($n$ terms) for [positive integers](/dictionary/definitions/natural-numbers-from-one) $n$.
  - >-
    A module need not have a [basis](/dictionary/definitions/vector-basis).
    In the [integers](/dictionary/definitions/integer) modulo $2$, as a module over the integers, $2 x = 0$ for every $x$, so no nonempty set of elements is [linearly independent](/dictionary/definitions/linearly-independent).
---
When the [ring](/dictionary/definitions/ring) $R$ is not [commutative](/dictionary/definitions/commutative), this definition gives a _left module_, and a _right module_ multiplies by scalars on the right.

"Module" also names a file of code in programming languages such as Python, which is unrelated.
