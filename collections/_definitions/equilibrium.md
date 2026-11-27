---
title: Equilibrium
term: equilibrium
applies_to: dynamical systems
synonyms: [equilibrium point, rest point, stationary point]
levels:
  elementary:
    text: |-
      Think of a system that changes over time, like a [ball](/dictionary/definitions/ball) rolling around in a bowl.
      An _equilibrium_ is a state in which the system stays put.
  high-school:
    text: |-
      Consider a system whose state changes over time.
      An _equilibrium_ is a state where the system stays as it is: if it starts there, it never moves.
  undergraduate:
    text: |-
      An _equilibrium_ of continuous-time system $\dot{x} = f(x)$ is a state $x^{\ast}$ with

      $$f(x^{\ast}) = 0.$$

      An _equilibrium_ of a discrete-time system $x_{k+1} = f(x_k)$ is a state $x^{\ast}$ such that 
      
      $$f(x^{\ast}) = x^{\ast}.$$
properties:
  - |-
    An equilibrium of $x_{k+1} = f(x_k)$ is a [fixed point](/dictionary/definitions/fixed-point) of $f$, but an equilibrium of $\dot{x} = f(x)$ is a zero of $f$, not a fixed point of $f$.
  - |-
    An equilibrium of $\dot{x} = f(x)$ is a [fixed point](/dictionary/definitions/fixed-point) of every [flow map](/dictionary/definitions/flow) $x(0) \mapsto x(t)$.
---
