---
published: false
title: Kernel of a linear map
term: kernel
applies_to: linear maps and matrices
synonyms: [null space, nullspace]
levels:
  undergraduate:
    text: |-
      Consider a [linear map](/definitions/linear-map) $T : V \to W$ (or a matrix $A$).
      The _kernel_ of $T$ is the set of vectors that $T$ maps to $0$:

      $$\ker T = \setdef{v \in V \suchthat T v = 0}.$$
properties:
  - >-
    $T$ is [injective](/definitions/injective) if and only if $\ker T = \setdef{0}$.
  - >-
    For an $m \times n$ matrix, $\dim \ker A + \operatorname{rank} A = n$ (the rank–nullity theorem).
---
