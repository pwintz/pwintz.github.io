---
published: false
title: Hamiltonian
term: Hamiltonian
applies_to: mechanical systems
levels:
  high-school:
    context: conservative mechanical systems
    text: |-
      Consider a mechanical system whose forces come from a potential energy.
      The _Hamiltonian_ of the system is the total energy, kinetic plus potential, written as a function of the positions and the momenta, instead of the positions and the velocities:

      $$H = T + V.$$
  undergraduate:
    context: classical mechanics
    text: |-
      Consider a mechanical system with generalized coordinates $q = (q_1, \dots, q_n)$, a [Lagrangian](/dictionary/definitions/lagrangian) $L(q, \dot{q}, t)$, and the [conjugate momenta](/dictionary/definitions/conjugate-momentum) $p_i = \partial L / \partial \dot{q}_i$.
      The _Hamiltonian_ of the system is

      $$H(q, p, t) = \sum_{i = 1}^{n} p_i \dot{q}_i - L(q, \dot{q}, t),$$

      where the velocities $\dot{q}$ are written as functions of $q$, $p$, and $t$.
properties:
  - >-
    The motions of the system satisfy Hamilton's equations $\dot{q}_i = \partial H / \partial p_i$ and $\dot{p}_i = -\partial H / \partial q_i$.
  - >-
    If the Hamiltonian does not depend on $t$, then the value of the Hamiltonian is constant along every motion.
  - >-
    If the kinetic energy $T$ is quadratic in the velocities and the potential energy $V$ depends only on the positions, then $H = T + V$ is the total energy.
---
The passage from $L(q, \dot{q}, t)$ to $H(q, p, t)$ is the Legendre transform in the velocities.

In [optimal control](/dictionary/definitions/optimal-control), the _Hamiltonian_ $H(x, u, \lambda) = \ell(x, u) + \lambda^\top f(x, u)$ of Pontryagin's maximum principle generalizes the Hamiltonian of mechanics, with the costate $\lambda$ in place of the momenta.
