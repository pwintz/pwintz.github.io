---
title: Identity function
term: identity function
applies_to: sets
synonyms: [identity map, '$\operatorname{id}_X$']
levels:
  high-school:
    text: |-
      Consider a set $X$.
      The _identity function_ on $X$ is the function from $X$ to $X$ that sends each element of $X$ to itself.
  undergraduate:
    text: |-
      Consider a set $X$.
      The _identity function_ on $X$ is the function $\operatorname{id}_X : X \to X$ defined by

      $$\operatorname{id}_X(x) = x \quad \text{for all } x \in X.$$
properties:
  - >-
    The identity function $\operatorname{id}_X$ is the [identity element](/dictionary/definitions/identity-element) of [function composition](/dictionary/definitions/function-composition) on the functions from $X$ to $X$: for every function $f : X \to X$,

    $$f \circ \operatorname{id}_X = \operatorname{id}_X \circ f = f.$$

    More generally, for every function $f : X \to Y$, $f \circ \operatorname{id}_X = f$ and $\operatorname{id}_Y \circ f = f$.
  - >-
    The identity function on $X$ is [bijective](/dictionary/definitions/bijective), and $\operatorname{id}_X$ is its own inverse.
  - >-
    The domain and the [codomain](/dictionary/definitions/codomain) of an identity function are the same set.
  - >-
    The identity function on $X$ is the [inclusion map](/dictionary/definitions/inclusion-map) of $X$ into itself.
---
The identity function on $X$ depends on the set $X$: the identity function on $[0, 1]$ and the identity function on $\reals$ are different functions, even though both are written $x \mapsto x$.

The identity function is different from an [identity element](/dictionary/definitions/identity-element) of an operation, such as $0$ for addition, though the identity function on $X$ is the identity element of [composition](/dictionary/definitions/function-composition) of functions from $X$ to $X$.

The identity function is also different from an [identity equation](/dictionary/definitions/identity-equation), such as $(x + 1)^2 = x^2 + 2x + 1$.

