---
title: Angle of Rotation
term: angle of rotation
applies_to: rotations and turning motions
synonyms: [rotation angle]
levels:
  high-school:
    text: |-
      Consider an object that turns about a fixed point in the plane.
      The _angle of rotation_ of the object is the total [angle](/dictionary/definitions/angular-measure) through which the object turns, positive if it turns counterclockwise and negative if it turns clockwise.
      For example, a wheel that turns twice counterclockwise has an angle of rotation of $720^\circ$.
    figure:
      widget: angle
      params: { mode: rotation, face: wheel, play: 720 }
      aspect: 1 / 1
      caption: |-
        A wheel, with the starting position of the blue spoke (dashed) and its turn so far (spiral), labeled with the angle of rotation.
        Drag the blue spoke around the axle, or play two counterclockwise turns.
      alt: A wheel with six spokes, one of them blue, which can be dragged around the axle. A dashed line marks its starting position, and a spiral arrow shows how far it has turned.
  undergraduate:
    context: rotations of the plane
    text: |-
      Consider a [rotation](/dictionary/definitions/rotation) $R$ of $\reals^2$ about the origin.
      The _angle of rotation_ of $R$ is the number $\theta$ such that

      $$R = \begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix}.$$

      The [angle](/dictionary/definitions/angular-measure) $\theta$ is determined up to a multiple of $2\pi$.
properties:
  - |-
    A turning motion and the [rotation](/dictionary/definitions/rotation) that takes the starting position to the final position are different things.
    A wheel that turns twice has an angle of rotation of $720^\circ$, but the rotation from its starting position to its final position is the identity, with an angle of rotation of $0^\circ$ (up to a multiple of $360^\circ$).
  - |-
    The [angular measure](/dictionary/definitions/angular-measure) of the angle between the starting and final positions of a line segment that turns about one of its endpoints is the absolute value of the angle of rotation, reduced to between $0^\circ$ and $180^\circ$.
  - |-
    In the plane, composing [rotations](/dictionary/definitions/rotation) about the same point adds their angles of rotation.
  - |-
    Every [rotation](/dictionary/definitions/rotation) of $\reals^3$ turns space about an axis through the origin, by Euler's rotation theorem.
    The angle of rotation $\theta$ of a rotation matrix $R$ satisfies $\trace{R} = 1 + 2 \cos \theta$, and its sign follows the right-hand rule about the chosen direction of the axis.
---
