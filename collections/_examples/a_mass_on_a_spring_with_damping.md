---
published: false
title: 'A mass $m$ on a spring with stiffness $k$ and damping $c > 0$, obeying $m \ddot{q} = -k q - c \dot{q}$'
level: graduate
is_not: [conservative_system]
values:
  lagrangian: '$L = e^{c t / m} \left( \frac{1}{2} m \dot{q}^2 - \frac{1}{2} k q^2 \right)$'
  conjugate_momentum: '$p = e^{c t / m} m \dot{q}$'
  hamiltonian: '$H = e^{-c t / m} p^2 / (2 m) + e^{c t / m} \frac{1}{2} k q^2$'
why:
  conservative_system: >-
    A damped mass on a spring is not a conservative system, because the damping force $-c \dot{q}$ depends on the velocity and turns mechanical energy into heat.
  lagrangian: >-
    The time-dependent function $L = e^{c t / m} \left( \frac{1}{2} m \dot{q}^2 - \frac{1}{2} k q^2 \right)$ is a Lagrangian of the damped mass on a spring (the Caldirola–Kanai Lagrangian), because the Euler–Lagrange equation is $e^{c t / m} (m \ddot{q} + c \dot{q} + k q) = 0$.
  conjugate_momentum: >-
    The conjugate momentum of the damped mass on a spring, for the Caldirola–Kanai Lagrangian, is $p = \partial L / \partial \dot{q} = e^{c t / m} m \dot{q}$, which differs from the ordinary momentum $m \dot{q}$.
  hamiltonian: >-
    The Hamiltonian of the damped mass on a spring, for the Caldirola–Kanai Lagrangian, depends on time, so the Hamiltonian is not the energy and is not constant along motions.
---
