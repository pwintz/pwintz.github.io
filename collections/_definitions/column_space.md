---
published: false
title: Column space of a matrix
term: column space
applies_to: matrices
synonyms: [column spaces]
levels:
  undergraduate:
    text: |-
      Consider an $m \times n$ matrix $A$ with columns $a_1, \dots, a_n \in \reals^m$.
      The _column space_ of $A$ is the [span](/dictionary/definitions/span) of its columns:

      $$\operatorname{col} A = \operatorname{span}(a_1, \dots, a_n) = \setdef{A x \suchthat x \in \reals^n}.$$
properties:
  - >-
    The column space of $A$ is the [image](/dictionary/definitions/image) of the [linear map](/dictionary/definitions/linear-map) $x \mapsto A x$, because $A x = x_1 a_1 + \dots + x_n a_n$ is a [linear combination](/dictionary/definitions/linear-combination) of the columns.
  - >-
    The dimension of the column space of $A$ is the [rank](/dictionary/definitions/matrix-rank) of $A$.
  - >-
    The equation $A x = b$ has a solution exactly when $b$ is in the column space of $A$.
---
