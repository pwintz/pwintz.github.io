---
title: Geometric Reflection
term: reflection (geometric)
applies_to: transformations of space
levels:
  elementary:
    text: |-
      A _reflection_ flips a shape across a line, like the image of the shape in a mirror, so that each point of the shape lands the same distance from the line, on the opposite side.
  high-school:
    text: |-
      Consider a line $\ell$ in the plane.
      The _reflection_ across $\ell$ is the transformation that sends each point $P$ to the point $P^{\prime}$ such that $\ell$ is the perpendicular bisector of the segment from $P$ to $P^{\prime}$, and sends each point on $\ell$ to itself.
  undergraduate:
    text: |-
      Consider a [unit vector](/dictionary/definitions/unit-vector) $\vect{n}$ in $\reals^n$.
      The _reflection_ across the hyperplane perpendicular to $\vect{n}$ is the [linear map](/dictionary/definitions/linear-map)

      $$\vect{x} \mapsto \vect{x} - 2 (\vect{n} \cdot \vect{x}) \vect{n}.$$
properties:
  - |-
    The matrix of the reflection across the hyperplane perpendicular to $\vect{n}$ is the _Householder matrix_ $I - 2 \vect{n} \vect{n}\trans$, which is symmetric and orthogonal, and has [determinant](/dictionary/definitions/determinant) $-1$.
  - |-
    Applying a reflection twice gives the [identity map](/dictionary/definitions/identity-function).
  - |-
    A reflection preserves distances and [angles](/dictionary/definitions/angular-measure), but reverses [orientation](/dictionary/definitions/orientation-rigid-body), such as turning a left hand into a right hand.
  - |-
    The [composition](/dictionary/definitions/function-composition) of two reflections in the plane, across lines that meet at an [angle](/dictionary/definitions/angular-measure) $\theta$, is a [rotation](/dictionary/definitions/rotation) by $2 \theta$.
---
The [reflection of a wave](/dictionary/definitions/reflection-wave) is a different meaning of "reflection": a [wave](/dictionary/definitions/wave) bouncing off of a boundary.
By the law of reflection, the direction of the reflected ray is the geometric reflection of the direction of the incident ray across the boundary.
