---
title: Force
term: force
applies_to: objects
synonyms: ['$\vect{F}$']
levels:
  elementary:
    text: |-
      Consider an object, like a ball at rest on a floor.
      A _force_ on the object is a push or a pull on the object, which has a size and a direction.
      A force changes the motion of the object, making the object accelerate in the direction of the force.
  high-school:
    # TODO: Clarify. 
    text: |-
      Consider an object of mass $m$.
      A _force_ on the object is a push or a pull on the object, which is a [vector](/dictionary/definitions/vector) because it has a size and a direction.
      The net force $\vect{F}$ on the object is the mass times the acceleration $\vect{a}$ of the object:

      $$\vect{F} = m \vect{a}.$$

      This equation is Newton's second law.
  undergraduate:
    context: classical mechanics
    text: |-
      Consider a particle with [momentum](/dictionary/definitions/momentum) $\vect{p}(t)$ at time $t$.
      The net _force_ on the particle is the rate of change of the momentum of the particle:

      $$\vect{F}(t) = \frac{\diff{\vect{p}}}{\diff{t}}.$$
properties:
  - |-
    If a particle has [constant](/dictionary/definitions/constant-function) mass $m$ and [velocity](/dictionary/definitions/velocity) $\vect{v}$, then the net force on the particle is $\vect{F} = m \, \diff{\vect{v}} / \diff{t}$, which is the mass times the acceleration.
  - |-
    The net force on a particle is the sum of the forces on the particle.
  - |-
    The [work](/dictionary/definitions/work) done by a force on a moving particle is the integral of the force along the path of the particle.
---
### Units

Force is measured in newtons (N).
One newton is $1 \ \mathrm{kg} \cdot \mathrm{m} / \mathrm{s}^2$.
