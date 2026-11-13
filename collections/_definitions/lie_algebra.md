---
title: Lie algebra
term: Lie algebra
applies_to: algebraic structures
synonyms: ['$\mathfrak{g}$']
levels:
  graduate:
    context: abstract algebra
    text: |-
      A _Lie algebra_ over a [field](/dictionary/definitions/field) $F$ is a [vector space](/dictionary/definitions/vector-space) $\mathfrak{g}$ over $F$ with a bilinear map $[\cdot, \cdot] : \mathfrak{g} \times \mathfrak{g} \to \mathfrak{g}$, called the [Lie bracket](/dictionary/definitions/lie-bracket), such that, for all $x, y, z \in \mathfrak{g}$,

      1. $[x, y] = -[y, x]$, and
      2. $[x, [y, z]] + [y, [z, x]] + [z, [x, y]] = 0$ (the Jacobi identity).
properties:
  - >-
    A Lie algebra is an [algebra](/dictionary/definitions/algebra-over-a-field) whose multiplication is the Lie bracket.
    This multiplication is not [associative](/dictionary/definitions/associative) in general, and it is [commutative](/dictionary/definitions/commutative) only when every bracket is $0$.
  - >-
    Every associative algebra, such as the $n \times n$ matrices, becomes a Lie algebra with the commutator $[a, b] = a b - b a$ as its bracket.
  - >-
    The smooth [vector fields](/dictionary/definitions/vector-field) on a manifold form a Lie algebra over $\reals$ with the Lie bracket of vector fields.
  - >-
    For a matrix Lie group $G$, the Lie algebra of $G$ is the set of matrices $X$ such that $e^{t X}$ is in $G$ for every real number $t$, with the commutator as its bracket; the [matrix exponential](/dictionary/definitions/matrix-exponential) maps the Lie algebra into the group.
---
Lie algebras are usually written in lowercase Fraktur letters, such as $\mathfrak{g}$ or $\mathfrak{so}(3)$, and matrix Lie groups in capital letters, such as $G$ or $SO(3)$.
