---
published: false
title: Conservative system
term: conservative system
applies_to: mechanical systems
levels:
  high-school:
    context: mechanics
    text: |-
      Consider a mechanical system moving under forces.
      The system is _conservative_ if the total energy of the system, kinetic plus potential, stays constant as the system moves.
    caveat: >-
      Some forces, such as the magnetic force on a moving charge, keep the total energy constant without coming from a potential energy, and the undergraduate definition does not call such systems conservative.
  undergraduate:
    context: classical mechanics
    text: |-
      Consider a mechanical system with generalized coordinates $q = (q_1, \dots, q_n)$.
      The system is _conservative_ if every force on the system comes from a potential energy $V(q)$ that depends only on the positions:

      $$F = -\nabla V(q).$$
properties:
  - >-
    In a conservative system, the total energy $E = T + V$, the kinetic energy plus the potential energy, is constant along every motion.
  - >-
    Friction, air resistance, and other damping forces make a system non-conservative, because these forces turn mechanical energy into heat.
  - >-
    A conservative system has the [Lagrangian](/definitions/lagrangian) $L = T - V$.
---
In dynamical systems, a system $\dot{x} = f(x)$ is often called _conservative_ if some function of the state, called a conserved quantity or first integral, is constant along every solution, or if the [flow](/definitions/flow) preserves volume.
