---
title: Signed Angle
term: signed angle
applies_to: pairs of vectors in the plane
synonyms: [oriented angle, directed angle]
levels:
  high-school:
    text: |-
      Consider two nonzero vectors $\vect{x}$ and $\vect{y}$ in the plane.
      The _signed angle_ from $\vect{x}$ to $\vect{y}$ is the [angle](/dictionary/definitions/angle) between $\vect{x}$ and $\vect{y}$, with a plus sign if turning $\vect{x}$ toward $\vect{y}$ the short way is counterclockwise and a minus sign if it is clockwise.
      So the signed angle is a number $\theta$ such that

      $$-180^\circ < \theta \le 180^\circ.$$


  # TODO: maybe would be better to use the dot product and cross product. 
  undergraduate:
    text: |-
      Consider nonzero vectors $\vect{x} = (x_1, x_2)$ and $\vect{y} = (y_1, y_2)$ in $\reals^2$.
      The _signed angle_ from $\vect{x}$ to $\vect{y}$ is the number $\theta \in (-\pi, \pi]$ such that

      $$\cos \theta = \frac{x_1 y_1 + x_2 y_2}{\norm{\vect{x}} \norm{\vect{y}}} \quad \text{and} \quad \sin \theta = \frac{x_1 y_2 - x_2 y_1}{\norm{\vect{x}} \norm{\vect{y}}}.$$
properties:
  - >-
    The absolute value of the signed angle from $\vect{x}$ to $\vect{y}$ is the [angle](/dictionary/definitions/angle) between $\vect{x}$ and $\vect{y}$.
  - >-
    The signed angle from $\vect{y}$ to $\vect{x}$ is the negative of the signed angle from $\vect{x}$ to $\vect{y}$, except when the vectors point in opposite directions, where both signed angles are $180^\circ$.
  - |-
    Programming languages compute the signed angle with the two-argument arctangent:

    $$\theta = \operatorname{atan2}(x_1 y_2 - x_2 y_1, \; x_1 y_1 + x_2 y_2).$$
  - >-
    Signed angles add: the signed angle from $\vect{x}$ to $\vect{z}$ is the sum of the signed angles from $\vect{x}$ to $\vect{y}$ and from $\vect{y}$ to $\vect{z}$, up to a multiple of $360^\circ$.
  - >-
    The sign depends on which side the plane is viewed from, because viewing the plane from behind swaps clockwise and counterclockwise.
    So, for two vectors in $\reals^3$, a signed angle needs a chosen axis perpendicular to both vectors, and the sign follows the right-hand rule about that axis.
  - >-
    Some texts take the signed angle in $[0^\circ, 360^\circ)$ instead, measuring the counterclockwise turn from $\vect{x}$ to $\vect{y}$.
---
