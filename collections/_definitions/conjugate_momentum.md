---
published: false
title: Conjugate momentum
term: conjugate momentum
applies_to: mechanical systems
synonyms: [canonical momentum, generalized momentum]
levels:
  undergraduate:
    context: classical mechanics
    text: |-
      Consider a mechanical system with generalized coordinates $q = (q_1, \dots, q_n)$ and a [Lagrangian](/dictionary/definitions/lagrangian) $L(q, \dot{q}, t)$.
      The _conjugate momentum_ to the coordinate $q_i$ is

      $$p_i = \frac{\partial L}{\partial \dot{q}_i}.$$
properties:
  - >-
    If a [Lagrangian](/dictionary/definitions/lagrangian) $L$ does not depend on the coordinate $q_i$, then the conjugate momentum $p_i$ is constant along every motion, because the Euler–Lagrange equation reads $\dot{p}_i = \partial L / \partial q_i = 0$.
  - >-
    The conjugate momenta are the variables, besides the coordinates, of the [Hamiltonian](/dictionary/definitions/hamiltonian).
---
The conjugate momentum depends on the choice of coordinates: conjugate to a position, it is often the ordinary momentum $m \dot{q}$, and conjugate to an angle, it is often an angular momentum.
