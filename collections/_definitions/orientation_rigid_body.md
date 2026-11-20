---
title: Orientation of a Rigid Body
term: orientation (of a rigid body)
applies_to: rigid bodies
# TODO: Include link to the 3D orientation tool page.
levels:
  elementary:
    text: |-
      The _orientation_ of an object is the way that the object is turned: which way the object faces and whether the object is tilted or upside down.
  high-school:
    text: |-
      Consider a rigid object, such as an airplane, and a fixed set of reference directions, such as north, east, and down.
      The _orientation_ of the object is how the object is turned relative to the reference directions, often described by three [angles](/dictionary/definitions/angle): yaw, pitch, and roll.
  undergraduate:
    text: |-
      Consider a rigid body in $\reals^3$, an [orthonormal](/dictionary/definitions/orthonormal) reference frame $\vect{e}_1, \vect{e}_2, \vect{e}_3$, and an orthonormal frame $\vect{b}_1, \vect{b}_2, \vect{b}_3$ attached to the body, both right-handed.
      The _orientation_ of the body is the [rotation](/dictionary/definitions/rotation) matrix $R$ such that

      $$\vect{b}_i = R \vect{e}_i \quad \text{for } i = 1, 2, 3.$$

    # TODO: For graduate version, use SO(3)
properties:
  - >-
    An orientation is a state, and a [rotation](/dictionary/definitions/rotation) is a change from one orientation to another.
    Because each orientation is described by the rotation from the reference frame to the body frame, the same matrix $R$ is called both the orientation of the body and a rotation.
  - >-
    The columns of $R$ are the body axes $\vect{b}_1, \vect{b}_2, \vect{b}_3$, written in the coordinates of the reference frame.
  - >-
    An orientation can be represented by a [rotation](/dictionary/definitions/rotation) matrix, by three Euler [angles](/dictionary/definitions/angle) (such as yaw, pitch, and roll), by an axis and an angle, or by a unit quaternion.
  - >-
    The orientation and the position of a rigid body together form its pose.
---

"Orientation" is also used in several other contexts. An orientation of a [vector space](/dictionary/definitions/vector-space) is a choice of handedness: a class of ordered bases, where two bases are in the same class if the matrix that changes one into the other has a positive [determinant](/dictionary/definitions/determinant).
An orientation of a graph is a choice of direction for each edge.

<!-- TODO: Maybe illustrate the difference between orientation and rotation by analogy with points and vectors. You cannot apply an orientation to an orientation, but you can apply a rotation to an orientation, much like how you cannot add a point to a point, but you can add a vector to a point. 

-->