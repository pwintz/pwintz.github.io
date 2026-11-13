---
title: Energy
term: energy
applies_to: physical systems
synonyms: ['$E$']
levels:
  high-school:
  # TODO: Add a more verbose description. Start by describing work. 
    text: |-
      Consider a physical system, such as a moving ball or a stretched spring.
      The _energy_ of the system is a number that measures the system's capacity to do work, that is, to push something through a distance.
      Energy is measured in joules (J).
  undergraduate:
    context: classical mechanics
    text: |-
      Consider a particle of mass $m$ at position $x$, moving with velocity $v$ in a conservative force field with potential energy $V(x)$.
      The (mechanical) _energy_ of the particle is the sum of its kinetic energy and its potential energy:

      $$E = \frac{1}{2} m \norm{v}^2 + V(x).$$
properties:
  - >-
    Energy is a scalar, which has a size but no direction.
  - >-
    The total energy of an isolated system is constant, but energy can change form.
    For example, in an inelastic collision, some kinetic energy is lost to other forms of energy, such as heat or sound.
  - >-
    The kinetic energy and the [momentum](/dictionary/definitions/momentum) $p = m v$ of a particle are related by $K = \norm{p}^2 / (2 m)$.
  - >-
    Energy is the conserved quantity that comes from symmetry under shifts in time (Noether's theorem).
---
One joule is $1 \ \mathrm{kg} \cdot \mathrm{m}^2 / \mathrm{s}^2$, or one newton meter.

For a [conservative system](/dictionary/definitions/conservative-system), the [Hamiltonian](/dictionary/definitions/hamiltonian) is the total energy.

<!-- TODO: Describe how these are related. -->
In signal processing, the "energy" of a signal $y$ is $\int \abs{y(t)}^2 \, \mathrm{d}t$, which is a different, though related, quantity.
