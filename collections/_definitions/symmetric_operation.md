---
published: false
title: Symmetric Operation
term: symmetric (operation)
applies_to: functions of two arguments
synonyms: [symmetric function of two arguments]
levels:
  high-school:
    text: |-
      Consider a rule $f$ that takes two inputs of the same kind and gives a result, like the distance between two points.
      The rule $f$ is _symmetric_ if swapping the two inputs does not change the result:

      $$f(x, y) = f(y, x).$$
  undergraduate:
    text: |-
      Consider a set $X$, a set $Y$, and a function $f : X \times X \to Y$.
      The function $f$ is _symmetric_ if

      $$f(x, y) = f(y, x) \quad \text{for all } x, y \in X.$$
properties:
  - >-
    A [binary operation](/dictionary/definitions/binary-operation) $\ast$ on a set $X$ is a function $X \times X \to X$, and $\ast$ is symmetric if and only if $\ast$ is [commutative](/dictionary/definitions/commutative).
  - >-
    A [bilinear form](/dictionary/definitions/bilinear-form) $B(x, y) = x\trans A y$ on $\reals^n$ is symmetric if and only if $A$ is a [symmetric matrix](/dictionary/definitions/symmetric-matrix).
---
### Terminology

The _symmetry_ condition in the definitions of an [inner product](/dictionary/definitions/inner-product) and a [metric](/dictionary/definitions/metric) is this property: $\ip{x}{y} = \ip{y}{x}$ and $d(x, y) = d(y, x)$.

"Symmetric" has other meanings that are easy to confuse with this one:

- A [symmetric relation](/dictionary/definitions/symmetric-relation) $\sim$ satisfies "$a \sim b$ implies $b \sim a$", which is a condition on which pairs are related, not on the value of a function.
- A [symmetric matrix](/dictionary/definitions/symmetric-matrix) $A$ is equal to its transpose, $A = A\trans$.
- In algebra, a _symmetric function_ (or symmetric [polynomial](/dictionary/definitions/polynomial)) of $n$ variables does not change under every [permutation](/dictionary/definitions/permutation) of its variables, such as $x_1 + x_2 + x_3$.
- The [symmetry of a shape](/dictionary/definitions/geometric-symmetry) is a transformation that leaves the shape unchanged.
