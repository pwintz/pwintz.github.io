---
title: Rotation
term: rotation
applies_to: maps of the plane and of space
synonyms: [rotation map]
levels:
  elementary:
    text: |-
      A _rotation_ is motion that turns a shape around a fixed point, without sliding, stretching, or flipping it.
  high-school:
    text: |-
      A _rotation_ of the plane is a map that turns every point about a fixed point, called the center, by the same [angle](/dictionary/definitions/angular-measure).  By
      By contention, a positive angle indicates counterclockwise rotation.

      The rotation about the origin by the angle $\theta$ moves the point $(x, y)$ to

      $$(x \cos \theta - y \sin \theta, \; x \sin \theta + y \cos \theta).$$
  undergraduate:
    text: |-
      A _rotation_ of $\reals^n$ is a [linear map](/dictionary/definitions/linear-map) $\vect{x} \mapsto R \vect{x}$, where $R$ is an $n \times n$ matrix such that

      $$R\trans R = I \quad \text{and} \quad \det R = 1.$$
    caveat: >-
      This definition covers rotations about the origin.
      The rotation about a point $\vect{p}$ that turns like $R$ is the affine map $\vect{x} \mapsto \vect{p} + R (\vect{x} - \vect{p})$.

  # TODO: Add a graduate version based on SO(3).
properties:
  - |-
    A rotation preserves distances, [angles](/dictionary/definitions/angular-measure), and handedness.
    The condition $\det R = 1$ rules out reflections, which preserve distances and angles but reverse handedness.
  - |-
    The rotations of $\reals^n$ about the origin form a group under [composition](/dictionary/definitions/function-composition), called the special orthogonal group $\mathrm{SO}(n)$.
  - |-
    A rotation of the plane is determined by its center and its [angle of rotation](/dictionary/definitions/angle-of-rotation).
    A rotation of $\reals^3$ is determined by its axis and its angle of rotation.
  - |-
    Rotations of the plane commute, but rotations of $\reals^3$ about different axes do not.
  - |-
    A rotation is a change, not a state: the [orientation](/dictionary/definitions/orientation-rigid-body) of a rigid body is described by the rotation that turns a reference frame onto the body.
---
