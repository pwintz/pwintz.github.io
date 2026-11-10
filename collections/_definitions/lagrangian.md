---
published: false
title: Lagrangian
term: Lagrangian
applies_to: mechanical systems
levels:
  high-school:
    context: conservative mechanical systems
    text: |-
      Consider a mechanical system whose forces come from a potential energy.
      The _Lagrangian_ of the system is the kinetic energy $T$ minus the potential energy $V$, written as a function of the positions and the velocities:

      $$L = T - V.$$
  undergraduate:
    context: classical mechanics
    text: |-
      Consider a mechanical system with generalized coordinates $q = (q_1, \dots, q_n)$.
      A _Lagrangian_ of the system is a function $L(q, \dot{q}, t)$ such that the motions of the system are exactly the solutions of the Euler–Lagrange equations

      $$\frac{\mathrm{d}}{\mathrm{d}t} \frac{\partial L}{\partial \dot{q}_i} = \frac{\partial L}{\partial q_i}, \qquad i = 1, \dots, n.$$
properties:
  - >-
    For a [conservative system](/definitions/conservative-system), $L = T - V$ is a Lagrangian.
  - >-
    The motions of a system with Lagrangian $L$ make the action $\int_{t_0}^{t_1} L(q, \dot{q}, t) \, \mathrm{d}t$ stationary (Hamilton's principle).
  - >-
    A system has many Lagrangians: adding the total time derivative of a function $F(q, t)$ to a Lagrangian gives the same Euler–Lagrange equations.
---
In optimization, the _Lagrangian_ of the problem "minimize $f(x)$ subject to $g(x) = 0$" is the different function $f(x) + \lambda^\top g(x)$, with Lagrange multipliers $\lambda$.
