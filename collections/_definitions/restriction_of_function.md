---
published: false
title: Restriction of a Function
term: restriction (of a function)
applies_to: functions
synonyms: ['$f|_A$']
levels:
  high-school:
    text: |-
      The _restriction_ of a function to a smaller set of inputs is the function that uses the same rule but accepts only the inputs in the smaller set.
      For example, restricting $f(x) = x^2$ to the inputs $x \geq 0$ gives a function that never gives the same output for two different inputs, whereas $f$ gives $f(-2) = f(2) = 4$.
  undergraduate:
    text: |-
      Consider a function $f : X \to Y$ and a [subset](/dictionary/definitions/subset) $A$ of $X$.
      The _restriction_ of $f$ to $A$ is the function $f|_A : A \to Y$ defined by

      $$f|_A(a) = f(a) \quad \text{for all } a \in A.$$
properties:
  - >-
    The restriction $f|_A$ is the [composition](/dictionary/definitions/function-composition) $f \circ \iota$, where $\iota : A \hookrightarrow X$ is the [inclusion map](/dictionary/definitions/inclusion-map).
  - >-
    If $f$ is [injective](/dictionary/definitions/injective), then every restriction of $f$ is injective.
  - >-
    If $X$ and $Y$ are topological spaces, $A$ has the [subspace topology](/dictionary/definitions/subspace-topology), and $f$ is [continuous](/dictionary/definitions/continuous), then $f|_A$ is continuous.
---
The restriction $f|_A$ has the same rule as $f$ but a smaller [domain](/dictionary/definitions/domain), so $f|_A$ and $f$ are different functions unless $A = X$.
