---
published: false
title: Kernel of a Linear Map
term: kernel
applies_to: linear maps and matrices
synonyms: [null space, nullspace]
levels:
  undergraduate:
    text: |-
      Consider a [linear map](/dictionary/definitions/linear-map) $T : V \to W$ (or a matrix $A$).
      The _kernel_ of $T$ is the set of vectors that $T$ maps to $0$:

      $$\nullspace{T} = \setdef{\vect{v} \in V \suchthat T \vect{v} = \vect{0}}.$$
properties:
  - >-
    $T$ is [injective](/dictionary/definitions/injective) if and only if $\nullspace{T} = \setdef{\vect{0}}$.
  - >-
    For an $m \times n$ matrix, $\dim \nullspace{A} + \rank{A} = n$ (the rank–nullity theorem).
---
