---
title: Conservative system
term: conservative system
applies_to: mechanical systems
levels:
  high-school:
    context: mechanics
    text: |-
      Consider a mechanical system moving under forces.
      The system is _conservative_ if the total energy of the system stays constant as the system moves.
      
      More precisely, for a system with total energy  

      $$E = U + K $$

      where $U$ is the potential energy and $K$ is the kinetic energy, the value of $E$ is constant over time:

      $$\frac{d}{dt} E = 0.$$

    # TODO: Explain this caveat more.
    # caveat: >-
    #   Some forces, such as the magnetic force on a moving charge, keep the total energy constant without coming from a potential energy, and the undergraduate definition does not call such systems conservative.
  undergraduate:
    context: classical mechanics
    text: |-
      Consider a mechanical system with generalized coordinates $q = (q_1, \dots, q_n)$.
      The system is _conservative_ if every force on the system comes from a potential energy $V(q)$ that depends only on the positions:

      $$F = -\nabla V(q).$$
  graduate:
    context: dynamical system
    text: |-
      A dynamical system $\dot x = f(x)$ is called _conservative_ if there exists a real-valued function $x \mapsto V(x)$ such that 

      $$f(x) = -\nabla V(x)$$
      
properties:
  - >-
    In a conservative system, the total energy $E = U + K$, the potential energy plus the kinetic energy, is constant along every motion.
  - >-
    Friction, air resistance, and other damping forces make a system non-conservative, because these forces turn mechanical energy into heat.
  - >-
    A conservative system has the [Lagrangian](/dictionary/definitions/lagrangian) $L = T - V$.
---
In dynamical systems, a system $\dot{x} = f(x)$ is sometimes called _conservative_ if the [flow](/dictionary/definitions/flow) preserves volume, which is a separate definition of the word.

<!-- TODO: Show why the three levels agree. -->