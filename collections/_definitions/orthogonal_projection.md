---
title: Orthogonal Projection
term: orthogonal projection
applies_to: vectors in an inner product space
synonyms: [projection onto a subspace, '$\operatorname{proj}_W \vect{x}$']
levels:
  high-school:
    text: |-
      Consider two [vectors](/dictionary/definitions/vector) $\vect{x}$ and $\vect{v}$ in the plane or in space such that $\vect{v} \neq \vect{0}$.
      The _orthogonal projection_ of $\vect{x}$ onto $\vect{v}$ is the multiple of $\vect{v}$ that is closest to $\vect{x}$:

      $$\operatorname{proj}_{\vect{v}} \vect{x} = \frac{\ip{\vect{x}}{\vect{v}}}{\norm{\vect{v}}^2} \, \vect{v}.$$

      Here, $\ip{\vect{x}}{\vect{v}}$ is the [dot product](/dictionary/definitions/dot-product) of $\vect{x}$ and $\vect{v}$.
  undergraduate:
    context: inner product spaces
    text: |-
      Consider an [inner product space](/dictionary/definitions/inner-product-space) $V$, a finite-dimensional subspace $W$ of $V$, and a vector $\vect{x} \in V$.
      The _orthogonal projection_ of $\vect{x}$ onto $W$ is the vector $\operatorname{proj}_W \vect{x} \in W$ such that $\vect{x} - \operatorname{proj}_W \vect{x}$ is [orthogonal](/dictionary/definitions/orthogonal-vectors) to every vector in $W$:

      $$\ip{\vect{x} - \operatorname{proj}_W \vect{x}}{\vect{w}} = 0 \quad \text{for every } \vect{w} \in W.$$
properties:
  - >-
    For every vector $\vect{x} \in V$, the orthogonal projection of $\vect{x}$ onto $W$ exists and is unique.
  - |-
    The orthogonal projection $\operatorname{proj}_W \vect{x}$ is the vector in $W$ closest to $\vect{x}$:

    $$\norm{\vect{x} - \operatorname{proj}_W \vect{x}} < \norm{\vect{x} - \vect{w}} \quad \text{for every } \vect{w} \in W \text{ such that } \vect{w} \neq \operatorname{proj}_W \vect{x}.$$
  - >-
    The orthogonal projection of $\vect{x}$ onto a nonzero vector $\vect{v}$ is equal to the orthogonal projection of $\vect{x}$ onto the line $\Span{\vect{v}}$.
  - |-
    If $\vect{u}_1, \dots, \vect{u}_k$ is an orthogonal [basis](/dictionary/definitions/vector-basis) of $W$, then the orthogonal projection onto $W$ is the sum of the orthogonal projections onto the basis vectors:

    $$\operatorname{proj}_W \vect{x} = \frac{\ip{\vect{x}}{\vect{u}_1}}{\norm{\vect{u}_1}^2} \, \vect{u}_1 + \dots + \frac{\ip{\vect{x}}{\vect{u}_k}}{\norm{\vect{u}_k}^2} \, \vect{u}_k.$$
  - |-
    Every vector $\vect{x} \in V$ is the sum of a vector in $W$ and a vector orthogonal to $W$:

    $$\vect{x} = \operatorname{proj}_W \vect{x} + (\vect{x} - \operatorname{proj}_W \vect{x}).$$
  - |-
    If the columns of a matrix $A$ form a basis of a subspace $W$ of $\reals^n$, then

    $$\operatorname{proj}_W \vect{x} = A (A\trans A)^{-1} A\trans \vect{x}.$$
  - |-
    Projecting a vector that is already in $W$ does not change the vector, so the orthogonal projection onto $W$ is [idempotent](/dictionary/definitions/idempotent): projecting twice gives the same vector as projecting once,

    $$\operatorname{proj}_W (\operatorname{proj}_W \vect{x}) = \operatorname{proj}_W \vect{x}.$$
---
### Terminology

The map $\vect{x} \mapsto \operatorname{proj}_W \vect{x}$ is a [linear map](/dictionary/definitions/linear-map), which is also called the _orthogonal projection_ onto $W$.
More generally, a _projection_ is an [idempotent](/dictionary/definitions/idempotent) linear map $P$, which means that $P^2 = P$.
The orthogonal projection onto $W$ is the projection whose [range](/dictionary/definitions/range-image) is $W$ and whose [kernel](/dictionary/definitions/kernel) is the set of vectors orthogonal to $W$.

The vector $\vect{x} - \operatorname{proj}_W \vect{x}$ is called the _component of $\vect{x}$ orthogonal to $W$_, and some books write it as $\operatorname{orth}_W \vect{x}$.

### Tool

The [Projections and Least Squares tool](/tools/projection_least_squares/) draws orthogonal projections in $\reals^2$ and $\reals^3$ and shows each step of the calculation.
