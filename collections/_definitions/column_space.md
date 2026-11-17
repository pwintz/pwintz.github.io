---
published: false
title: Column Space of a Matrix
term: column space
applies_to: matrices
synonyms: [column spaces]
levels:
  undergraduate:
    text: |-
      Consider an $m \times n$ matrix $A$ with columns $\vect{a}_1, \dots, \vect{a}_n \in \reals^m$.
      The _column space_ of $A$ is the [span](/dictionary/definitions/span) of its columns:

      $$\colspace{A} = \Span{\vect{a}_1, \dots, \vect{a}_n} = \setdef{A \vect{x} \suchthat \vect{x} \in \reals^n}.$$
properties:
  - >-
    The column space of $A$ is the [image](/dictionary/definitions/image) of the [linear map](/dictionary/definitions/linear-map) $\vect{x} \mapsto A \vect{x}$, because $A \vect{x} = x_1 \vect{a}_1 + \dots + x_n \vect{a}_n$ is a [linear combination](/dictionary/definitions/linear-combination) of the columns.
  - >-
    The dimension of the column space of $A$ is the [rank](/dictionary/definitions/matrix-rank) of $A$.
  - >-
    The equation $A \vect{x} = \vect{b}$ has a solution exactly when $\vect{b}$ is in the column space of $A$.
---
