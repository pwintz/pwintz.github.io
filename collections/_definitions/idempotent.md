---
title: Idempotent
term: idempotent
applies_to: elements and functions
levels:
  high-school:
    text: |-
      Consider an operation that you can apply again to its own result, like rounding a number.
      The operation is _idempotent_ if doing it twice gives the same result as doing it once.
  undergraduate:
    text: |-
      Consider an element $x$ of a set with a [binary operation](/dictionary/definitions/binary-operation) $\ast$, or a function $f$ from a set to itself.
      The element $x$ is _idempotent_ if $x \ast x = x$.
      The function $f$ is _idempotent_ if applying it twice is the same as applying it once:

      $$f \circ f = f.$$
properties:
  - |- 
      A square matrix $P$ is _idempotent_ if $P^2 = P$, which means that the [linear map](/dictionary/definitions/linear-map) $\vect{x} \mapsto P \vect{x}$ is idempotent.
  - |-
    Every [orthogonal projection](/dictionary/definitions/orthogonal-projection) is idempotent, because projecting a vector that is already in the subspace does not change the vector.
  - |-
    Every [eigenvalue](/dictionary/definitions/eigenvalue) of an idempotent matrix is $0$ or $1$.
  
---
