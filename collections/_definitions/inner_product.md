---
title: Inner product
term: inner product
applies_to: vector spaces
synonyms: ["$\\ip{x}{y}$"]
levels:
  high-school:
    text: |-
      An _inner product_ is a way of multiplying two [vectors](/definitions/vector) to get a number, generalizing the [dot product](/definitions/dot-product), that gives a way to measure lengths and angles.
  undergraduate:
    context: real vector spaces
    text: |-
      Consider a real [vector](/definitions/vector) space $V$ and a function $\ip{\cdot}{\cdot} : V \times V \to \reals$.
      The function is an _inner product_ if

      1. it is linear in its first argument: $\ip{a x + y}{z} = a \ip{x}{z} + \ip{y}{z}$ for all $x, y, z \in V$ and $a \in \reals$,
      2. it is symmetric: $\ip{x}{y} = \ip{y}{x}$ for all $x, y \in V$, and
      3. it is [positive definite](/definitions/positive-definite-function): $\ip{x}{x} > 0$ for for all $x \neq 0 in $V$.
    caveat: >-
      For complex vector spaces, [symmetry](/definitions/geometric-symmetry) is replaced by conjugate symmetry, $\ip{x}{y} = \overline{\ip{y}{x}}$, so the inner product is linear in one argument and conjugate-linear in the other.
  graduate:
    context: real or complex vector spaces
    text: |-
      Consider a vector space $V$ over $\mathbb{F}$, where $\mathbb{F}$ is $\reals$ or $\mathbb{C}$, and a sesquilinear form $\ip{\cdot}{\cdot}$ on $V$: a function $V \times V \to \mathbb{F}$ that is linear in its first argument and conjugate-linear in its second.
      The form is an _inner product_ if, for all $x, y \in V$,

      1. it is Hermitian: $\ip{x}{y} = \overline{\ip{y}{x}}$, and
      2. it is positive definite: $\ip{x}{x} > 0$ for $x \neq 0$.

      Over $\reals$, a sesquilinear form is a [bilinear form](/definitions/bilinear-form), and Hermitian means symmetric.
---
