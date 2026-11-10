---
title: 'A mass $m$ on a frictionless spring with stiffness $k$, at position $q$'
detail: |-
  A block of mass $m$ slides without friction on a horizontal surface, attached to a wall by a spring with stiffness $k$.
  The coordinate $q$ is the displacement of the block from the position where the spring is relaxed, and the spring pulls the block back with the force $-k q$ (Hooke's law).
  By Newton's second law, the motion of the block obeys

  $$m \ddot{q} = -k q.$$
level: undergraduate
is: [conservative_system]
values:
  lagrangian: '$L = \frac{1}{2} m \dot{q}^2 - \frac{1}{2} k q^2$'
  conjugate_momentum: '$p = m \dot{q}$'
  hamiltonian: '$H = p^2 / (2 m) + \frac{1}{2} k q^2$'
why:
  conservative_system: >-
    A mass on a frictionless spring is a conservative system, because the spring force $-k q$ is the negative derivative of the potential energy $V(q) = \frac{1}{2} k q^2$.
  lagrangian: >-
    The Lagrangian of a mass on a frictionless spring is $L = T - V$, with the kinetic energy $T = \frac{1}{2} m \dot{q}^2$ and the potential energy $V = \frac{1}{2} k q^2$.
    The Euler–Lagrange equation is $m \ddot{q} = -k q$.
  conjugate_momentum: >-
    The conjugate momentum of a mass on a frictionless spring is $p = \partial L / \partial \dot{q} = m \dot{q}$, which is the ordinary momentum.
  hamiltonian: >-
    The Hamiltonian of a mass on a frictionless spring is $H = p \dot{q} - L$ with $\dot{q} = p / m$, which gives the total energy $p^2 / (2 m) + \frac{1}{2} k q^2$.
---
