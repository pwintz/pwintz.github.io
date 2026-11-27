---
title: Root of a Polynomial
term: root (of a polynomial)
applies_to: polynomials
levels:
  high-school:
    text: |-
      Consider a [polynomial](/dictionary/definitions/polynomial) $p$.
      A _root_ of $p$ is a number $a$, real or complex, such that

      $$p(a) = 0.$$
  undergraduate:
    context: algebra
    text: |-
      Consider a [polynomial](/dictionary/definitions/polynomial) $p$ with [coefficients](/dictionary/definitions/coefficient) in a [field](/dictionary/definitions/field) $F$, and a field $E$ that contains $F$.
      A _root_ of $p$ in $E$ is an element $a \in E$ such that

      $$p(a) = 0.$$
properties:
  - |-
    A polynomial can have no roots in the field $F$ of its coefficients but have roots in a larger field $E$.
    For example, $x^2 + 1$ has no roots in $\reals$, and its roots in $\complexes$ are $i$ and $-i$.
  - |-
    If $p$ has real coefficients, then the roots of $p$ in $\reals$ are the zeros of the [polynomial function](/dictionary/definitions/polynomial-function) $x \mapsto p(x)$ on $\reals$.
    The roots of $p$ in $\complexes$ that are not real are not zeros of that function, because they are not in its domain.
  - |-
    An element $a \in E$ is a root of $p$ if and only if $p(x) = (x - a) q(x)$ for some [polynomial](/dictionary/definitions/polynomial) $q$ with coefficients in $E$ (the factor theorem).
  - |-
    A nonzero [polynomial](/dictionary/definitions/polynomial) of degree $n$ with coefficients in $F$ has at most $n$ roots in each field $E$ that contains $F$.
  - |-
    Every [polynomial](/dictionary/definitions/polynomial) of degree $n \geq 1$ with complex coefficients has exactly $n$ complex roots, counted with multiplicity (the fundamental theorem of algebra).
  - |-
    If $p$ has real coefficients and $a$ is a root of $p$ in $\complexes$, then the [complex conjugate](/dictionary/definitions/complex-conjugate) $\conj{a}$ is also a root of $p$.
---
Consider a root $a$ of a nonzero [polynomial](/dictionary/definitions/polynomial) $p$.
The _multiplicity_ of $a$ is the largest [integer](/dictionary/definitions/integer) $k$ such that, for some polynomial $q$,

$$p(x) = (x - a)^k q(x).$$

A root of multiplicity $1$ is called a _simple root_, and a root of multiplicity $2$ or more is called a _repeated root_.
