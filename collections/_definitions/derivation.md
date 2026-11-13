---
published: false
title: Derivation (algebra)
term: derivation
applies_to: algebras
levels:
  undergraduate:
    context: abstract algebra
    text: |-
      Consider an [algebra](/dictionary/definitions/algebra-over-a-field) $A$ over a [field](/dictionary/definitions/field) $F$.
      A _derivation_ of $A$ is a [linear map](/dictionary/definitions/linear-map) $D : A \to A$ that satisfies the product rule (the Leibniz rule):

      $$D(a b) = (D a) \, b + a \, (D b) \quad \text{for all } a, b \in A.$$
properties:
  - >-
    Every smooth [vector field](/dictionary/definitions/vector-field) $X$ on a manifold $M$ is a [derivation](/dictionary/definitions/derivation) $f \mapsto X f$ of the algebra of smooth functions on $M$, and every derivation of that algebra comes from a vector field.
  - >-
    The commutator $D_1 D_2 - D_2 D_1$ of two [derivations](/dictionary/definitions/derivation) is a derivation, but the [composition](/dictionary/definitions/function-composition) $D_1 D_2$ need not be one.
  - >-
    For each element $x$ of a Lie algebra, the map $y \mapsto [x, y]$ is a [derivation](/dictionary/definitions/derivation) of the [Lie bracket](/dictionary/definitions/lie-bracket); this statement is equivalent to the Jacobi identity.
  - >-
    If $A$ has an [identity element](/dictionary/definitions/identity-element) $1$, then every [derivation](/dictionary/definitions/derivation) $D$ of $A$ satisfies $D(1) = 0$, because $D(1) = D(1 \cdot 1) = 2 D(1)$.
---
A _derivation at a point_ $p$ is a [linear map](/dictionary/definitions/linear-map) $v$ from smooth functions to $\reals$ such that $v(f g) = v(f) \, g(p) + f(p) \, v(g)$.
In differential geometry, tangent vectors at $p$ are often defined as [derivations](/dictionary/definitions/derivation) at $p$.

In logic, a "derivation" is a formal proof, which is unrelated.
