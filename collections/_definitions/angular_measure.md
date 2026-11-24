---
title: Angular Measure
term: angular measure
applies_to: angles
synonyms: [measure of an angle, '$m\angle ABC$']
levels:
  elementary:
    text: |-
      The _angular measure_ of an [angle](/dictionary/definitions/angle-geometric-figure) is the amount of rotation needed to turn one side of the angle onto the other side.
      A full turn is $360$ degrees, so a quarter turn, like the corner of a square, is $90$ degrees.
  high-school:
    text: |-
      Consider an [angle](/dictionary/definitions/angle-geometric-figure).
      The _angular measure_ of the angle is the number that gives the size of the angle in a chosen unit, usually degrees or radians.
      In radians, the measure of an angle is the length $s$ of the arc that the angle cuts from a [circle](/dictionary/definitions/circle) of radius $r$ centered at its vertex, divided by $r$:

      $$\theta = \frac{s}{r}.$$
  undergraduate:
    context: inner product spaces
    text: |-
      Consider a real [inner product space](/dictionary/definitions/inner-product-space) $V$ and nonzero vectors $\vect{x}, \vect{y} \in V$.
      The _angular measure_ of the angle between $\vect{x}$ and $\vect{y}$ is the number $\theta \in [0, \pi]$ such that

      $$\cos \theta = \frac{\ip{\vect{x}}{\vect{y}}}{\norm{\vect{x}} \norm{\vect{y}}}.$$
properties:
  - |-
    One [angle](/dictionary/definitions/angle-geometric-figure) has different measures in different units.
    For example, a [right angle](/dictionary/definitions/right-angle) measures $90^\circ$ and $\pi/2$ radians, and a full turn measures $360^\circ$ and $2\pi$ radians.
  - |-
    The measure of the angle between nonzero vectors $\vect{x}$ and $\vect{y}$ is $0$ if and only if $\vect{y}$ is a positive multiple of $\vect{x}$, and $\pi$ if and only if $\vect{y}$ is a negative multiple of $\vect{x}$.
  - |-
    Two nonzero vectors are [orthogonal](/dictionary/definitions/orthogonal-vectors) if and only if the measure of the angle between them is $\pi/2$.
  - |-
    The angle between a vector and the [zero vector](/dictionary/definitions/zero-vector) is undefined, because the zero vector has no direction.
---
### Units

A measure in radians is a [ratio](/dictionary/definitions/ratio) of two lengths, so it has no [physical dimension](/dictionary/definitions/physical-dimension).

Other units of angular measure include 
- turns (one turn is $360^\circ$), 
- gradians ($400$ per turn), 
- arcminutes and arcseconds ($1^\circ = 60$ arcminutes $= 3600$ arcseconds).

Calculus formulas such as $\frac{\diff{}}{\diff{\theta}} \sin \theta = \cos \theta$ hold only when $\theta$ is measured in radians.

### Angles between vectors

For nonzero vectors $\vect{x}$ and $\vect{y}$ in $\reals^n$, the measure $\theta$ of the angle between $\vect{x}$ and $\vect{y}$ satisfies

$$\cos \theta = \frac{\vect{x} \cdot \vect{y}}{\norm{\vect{x}} \norm{\vect{y}}},$$

where $\vect{x} \cdot \vect{y}$ is the [dot product](/dictionary/definitions/dot-product).

The formula with the dot product agrees with the measure of the angle in the plane.
By the law of cosines, the triangle with sides $\vect{x}$, $\vect{y}$, and $\vect{x} - \vect{y}$ satisfies

$$\norm{\vect{x} - \vect{y}}^2 = \norm{\vect{x}}^2 + \norm{\vect{y}}^2 - 2 \norm{\vect{x}} \norm{\vect{y}} \cos \theta,$$

and expanding $\norm{\vect{x} - \vect{y}}^2 = \norm{\vect{x}}^2 + \norm{\vect{y}}^2 - 2(\vect{x} \cdot \vect{y})$ gives the formula.

In a real [inner product space](/dictionary/definitions/inner-product-space), the [Cauchy–Schwarz inequality](/dictionary/definitions/cauchy-schwarz-inequality) states that the fraction

$$\frac{\ip{\vect{x}}{\vect{y}}}{\norm{\vect{x}} \norm{\vect{y}}}$$

is between $-1$ and $1$, so a unique value of $\theta \in [0, \pi]$ satisfies the undergraduate definition.

### Notation

Geometry texts often write $\angle ABC$ for the [angle](/dictionary/definitions/angle-geometric-figure) at $B$ and $m\angle ABC$ for its measure.
Elsewhere, "angle" usually means the measure, as in "the angle $\theta = \pi/4$."
