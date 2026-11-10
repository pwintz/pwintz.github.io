---
published: false
title: 'A particle of mass $m$ and charge $e$ at position $x \in \reals^3$, in a magnetic field with vector potential $A(x)$ and no electric field'
level: graduate
values:
  lagrangian: '$L = \frac{1}{2} m \norm{\dot{x}}^2 + e \, \dot{x} \cdot A(x)$'
  conjugate_momentum: '$p = m \dot{x} + e A(x)$'
  hamiltonian: '$H = \norm{p - e A(x)}^2 / (2 m)$'
why:
  lagrangian: >-
    The Lagrangian of a charged particle in a magnetic field is $\frac{1}{2} m \norm{\dot{x}}^2 + e \, \dot{x} \cdot A(x)$, whose Euler–Lagrange equations give the Lorentz force $m \ddot{x} = e \, \dot{x} \times (\nabla \times A)$.
    The magnetic force depends on the velocity, so the magnetic force does not come from a potential energy $V(x)$, even though the force does no work.
  conjugate_momentum: >-
    The conjugate momentum of a charged particle in a magnetic field is $p = \partial L / \partial \dot{x} = m \dot{x} + e A(x)$, which differs from the ordinary momentum $m \dot{x}$.
  hamiltonian: >-
    The Hamiltonian of a charged particle in a magnetic field is $H = p \cdot \dot{x} - L$ with $\dot{x} = (p - e A) / m$, which gives the kinetic energy $\frac{1}{2} m \norm{\dot{x}}^2$ written in terms of $p$.
---
