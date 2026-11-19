---
published: false
title: Angle
term: angle
applies_to: rays and vectors
synonyms: ['$\theta$']
levels:
  elementary:
    text: |-
      Consider two rays that start at the same point.
      The _angle_ between the rays is how much one ray must turn to point along the other.
      A full turn is $360$ degrees, so a quarter turn, like the corner of a square, is $90$ degrees.
  high-school:
    text: |-
      Consider two nonzero vectors $\vect{x}$ and $\vect{y}$.
      The _angle_ between $\vect{x}$ and $\vect{y}$ is the number $\theta$ in $[0, \pi]$ such that

      $$\cos \theta = \frac{\vect{x} \cdot \vect{y}}{\norm{\vect{x}} \norm{\vect{y}}},$$

      where $\vect{x} \cdot \vect{y}$ is the [dot product](/dictionary/definitions/dot-product).
  undergraduate:
    text: |-
      Consider a real [inner product space](/dictionary/definitions/inner-product-space) $V$ and nonzero vectors $\vect{x}, \vect{y} \in V$.
      The _angle_ between $\vect{x}$ and $\vect{y}$ is the number $\theta \in [0, \pi]$ such that

      $$\cos \theta = \frac{\ip{\vect{x}}{\vect{y}}}{\norm{\vect{x}} \norm{\vect{y}}}.$$
properties:
  - >-
    The [Cauchy–Schwarz inequality](/dictionary/definitions/cauchy-schwarz-inequality) states that the fraction $\ip{\vect{x}}{\vect{y}} / (\norm{\vect{x}} \norm{\vect{y}})$ is between $-1$ and $1$, so exactly one $\theta \in [0, \pi]$ satisfies the definition.
  - >-
    Two nonzero vectors are [orthogonal](/dictionary/definitions/orthogonal-vectors) if and only if the angle between them is $\pi/2$, which is a [right angle](/dictionary/definitions/right-angle).
  - >-
    The angle between $\vect{x}$ and $\vect{y}$ is $0$ if and only if $\vect{y}$ is a positive multiple of $\vect{x}$, and $\pi$ if and only if $\vect{y}$ is a negative multiple of $\vect{x}$.
  - >-
    The angle between a vector and the [zero vector](/dictionary/definitions/zero-vector) is undefined, because the zero vector has no direction.
  - >-
    The definition with the [dot product](/dictionary/definitions/dot-product) agrees with the angle measured in the plane: by the law of cosines, the triangle with sides $\vect{x}$, $\vect{y}$, and $\vect{x} - \vect{y}$ has $\norm{\vect{x} - \vect{y}}^2 = \norm{\vect{x}}^2 + \norm{\vect{y}}^2 - 2 \norm{\vect{x}} \norm{\vect{y}} \cos \theta$.
  - >-
    The [angular measure](/dictionary/definitions/angular-measure) of an angle is given in degrees or in radians, where $360$ degrees equals $2\pi$ radians.
  - >-
    The angle between $\vect{x}$ and $\vect{y}$ does not depend on the order of the vectors.
    In the plane, the [signed angle](/dictionary/definitions/signed-angle) from $\vect{x}$ to $\vect{y}$ also says whether the turn from $\vect{x}$ to $\vect{y}$ is counterclockwise or clockwise.
---
