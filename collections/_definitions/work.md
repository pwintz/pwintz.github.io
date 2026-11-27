---
title: Work
term: work
applies_to: forces
synonyms: ['$W$']
levels:
  high-school:
    text: |-
      Consider a constant [force](/dictionary/definitions/force) $\vect{F}$ acting on an object while the object moves through a [displacement](/dictionary/definitions/displacement) $\vect{d}$.
      The _work_ done by the force is the amount of [energy](/dictionary/definitions/energy) that the force transfers to the object, which is

      $$W = \vect{F} \cdot \vect{d}.$$
  undergraduate:
    context: classical mechanics
    text: |-
      Consider a [force](/dictionary/definitions/force) $\vect{F}(t)$ acting on a particle with position $\vect{x}(t)$ and [velocity](/dictionary/definitions/velocity) $\vect{v}(t)$ at time $t$.
      The _work_ done by the force on the particle between times $t_0$ and $t_1$ is

      $$W = \int_{t_0}^{t_1} \vect{F}(t) \cdot \diff{\vect{x}}(t) = \int_{t_0}^{t_1} \vect{F}(t) \cdot \vect{v}(t) \dt.$$
properties:
  - |-
    Work is a scalar, which can be negative.
    Negative work means that the [force](/dictionary/definitions/force) opposes the motion of the particle, causing the particle to lose energy.
  - |-
    A [force](/dictionary/definitions/force) that is perpendicular to the [velocity](/dictionary/definitions/velocity) of a particle does no work on the particle.
  - |-
    The work done by the net [force](/dictionary/definitions/force) on a particle is the change in the kinetic [energy](/dictionary/definitions/energy) of the particle (the work-energy theorem).
  - |-
    The rate at which a [force](/dictionary/definitions/force) does work is the [power](/dictionary/definitions/power) $P$ delivered by the force: 
    
    $$P = \frac{\diff{W}}{\diff{t}} = \vect{F} \cdot \vect{v}.$$
---
### Units

Work is measured in joules (J), which are the same units as [energy](/dictionary/definitions/energy).
One joule is one newton meter, $1 \ \mathrm{N} \cdot \mathrm{m}$.
