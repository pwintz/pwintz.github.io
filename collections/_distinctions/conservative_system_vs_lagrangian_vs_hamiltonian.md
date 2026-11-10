---
published: false
title: Conservative system vs. Lagrangian vs. Hamiltonian
kind: family
areas: [dynamics]
summary: >
  Classical mechanics describes the motion of a system in terms of generalized coordinates $q$, such as positions and angles.
  A [conservative system](/definitions/conservative-system) is a system whose forces come from a potential energy $V(q)$, so the total energy is constant.
  The [Lagrangian](/definitions/lagrangian) $L(q, \dot{q}, t)$ is a function of the positions and velocities whose Euler–Lagrange equations are the equations of motion; for a conservative system, $L = T - V$.
  The [conjugate momentum](/definitions/conjugate-momentum) $p = \partial L / \partial \dot{q}$ is the variable that replaces the velocity $\dot{q}$.
  The [Hamiltonian](/definitions/hamiltonian) $H(q, p, t) = p \cdot \dot{q} - L$ is a function of the positions and the conjugate momenta; for a conservative system, $H = T + V$ is the total energy.
  Being conservative is a property of a system, whereas the Lagrangian and the Hamiltonian are functions that describe a system, conservative or not.
terms:
  - conservative_system
  - lagrangian
  - conjugate_momentum
  - hamiltonian
examples_note: >-
  Each cell is the value of the column's quantity for the system in that row, or whether the system is conservative.
examples:
  - example: a_mass_on_a_frictionless_spring
  - example: a_frictionless_pendulum_at_angle_theta
  - example: a_mass_on_a_spring_with_damping
    why: >-
      A damped mass on a spring is not conservative, but the damped mass on a spring still has a Lagrangian and a Hamiltonian, which depend on time, so having a Lagrangian or a Hamiltonian does not make a system conservative.
  - example: a_charged_particle_in_a_magnetic_field
    why: >-
      For a charged particle in a magnetic field, the conjugate momentum $m \dot{x} + e A$ differs from the ordinary momentum $m \dot{x}$, so the conjugate momentum depends on the Lagrangian, not only on the motion.
see_also:
  - calculus_of_variations_vs_optimal_control
---
## Notes

- The [Lagrangian](/definitions/lagrangian) $T - V$ and the [Hamiltonian](/definitions/hamiltonian) $T + V$ differ by the sign of $V$, because $H = p \cdot \dot{q} - L$ and $p \cdot \dot{q} = 2T$ when $T$ is quadratic in the velocities.
- The Euler–Lagrange equations are $n$ second-order equations, whereas Hamilton's equations are $2n$ first-order equations.
- "Lagrangian" also names the function $f(x) + \lambda^\top g(x)$ in constrained optimization, and "Hamiltonian" also names the function $\ell(x, u) + \lambda^\top f(x, u)$ in Pontryagin's maximum principle.
