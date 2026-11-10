---
published: false
title: 'A frictionless pendulum of mass $m$ and length $\ell$, at the angle $\theta$ from straight down'
level: undergraduate
is: [conservative_system]
values:
  lagrangian: '$L = \frac{1}{2} m \ell^2 \dot{\theta}^2 + m g \ell \cos \theta$'
  conjugate_momentum: '$p_\theta = m \ell^2 \dot{\theta}$'
  hamiltonian: '$H = p_\theta^2 / (2 m \ell^2) - m g \ell \cos \theta$'
why:
  conservative_system: >-
    A frictionless pendulum is a conservative system, because gravity comes from the potential energy $V(\theta) = -m g \ell \cos \theta$, and the rod's tension does no work.
  lagrangian: >-
    The Lagrangian of a frictionless pendulum is $L = T - V$, with the kinetic energy $T = \frac{1}{2} m \ell^2 \dot{\theta}^2$ and the potential energy $V = -m g \ell \cos \theta$.
  conjugate_momentum: >-
    The conjugate momentum to the angle $\theta$ of a frictionless pendulum is $p_\theta = \partial L / \partial \dot{\theta} = m \ell^2 \dot{\theta}$, which is the angular momentum about the pivot, not a linear momentum.
  hamiltonian: >-
    The Hamiltonian of a frictionless pendulum is $H = p_\theta \dot{\theta} - L$ with $\dot{\theta} = p_\theta / (m \ell^2)$, which gives the total energy $T + V$.
---
