---
published: false
title: Inclusion map
term: inclusion map
applies_to: subsets
synonyms: [inclusion function, canonical injection, '$\iota$']
levels:
  undergraduate:
    text: |-
      Consider a set $Y$ and a [subset](/dictionary/definitions/subset) $A$ of $Y$.
      The _inclusion map_ of $A$ into $Y$ is the function $\iota : A \to Y$ that sends each element of $A$ to itself, as an element of $Y$:

      $$\iota(a) = a \quad \text{for all } a \in A.$$

      The inclusion map is often written with a hooked arrow, $\iota : A \hookrightarrow Y$.
properties:
  - >-
    The inclusion map of $A$ into $Y$ is [injective](/dictionary/definitions/injective).
    The inclusion map is [surjective](/dictionary/definitions/surjective) only when $A = Y$, and then it is the [identity function](/dictionary/definitions/identity-function) on $Y$.
  - >-
    For a function $f : Y \to Z$, the [composition](/dictionary/definitions/function-composition) $f \circ \iota$ is the restriction of $f$ to $A$.
  - >-
    If $Y$ is a topological space and $A$ has the subspace [topology](/dictionary/definitions/topology), then the inclusion map of $A$ into $Y$ is [continuous](/dictionary/definitions/continuous); in fact, the inclusion map is a topological embedding.
---
