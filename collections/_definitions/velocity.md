---
published: false
title: Velocity
term: velocity
applies_to: moving objects
synonyms: ['$\vect{v}$']
levels:
  high-school:
    text: |-
      Consider an object that is moving, like a [ball](/dictionary/definitions/ball) rolling across a floor.
      The _velocity_ of the object is a [vector](/dictionary/definitions/vector) that points in the direction the object is moving and whose length is the speed of the object, which is the distance traveled per unit time.
  undergraduate:
    context: classical mechanics
    text: |-
      Consider a particle with position $\vect{x}(t)$ at time $t$.
      The _velocity_ of the particle is the rate of change of the position of the particle:

      $$\vect{v}(t) = \frac{\diff{\vect{x}}}{\diff{t}}.$$
properties:
  - |-
    The length $\norm{\vect{v}(t)}$ of the velocity is the speed of the particle.
  - |-
    The [displacement](/dictionary/definitions/displacement) of the particle between times $t_0$ and $t_1$ is the integral of the velocity: $\int_{t_0}^{t_1} \vect{v}(t) \dt = \vect{x}(t_1) - \vect{x}(t_0)$.
  - |-
    The [momentum](/dictionary/definitions/momentum) of a particle with mass $m$ is $\vect{p} = m \vect{v}$.
---
### Units

Velocity is measured in meters per second, $\mathrm{m} / \mathrm{s}$.
