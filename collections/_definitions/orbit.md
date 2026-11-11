---
published: false
title: Orbit
term: orbit
applies_to: dynamical systems
levels:
  high-school:
    text: |-
      Consider a system whose state changes over time according to a rule, and a starting state $x_0$.
      The _orbit_ of $x_0$ is the set of all states that the system passes through, starting from $x_0$, without the times at which the system reaches them.
  undergraduate:
    context: ordinary differential equations
    text: |-
      Consider a dynamical system $\dot{x} = f(x)$ on $\reals^n$ whose solutions are unique, and a state $x_0$.
      Let $x : I \to \reals^n$ be the maximal solution with $x(0) = x_0$.
      The _orbit_ of $x_0$ is the image of $x$:

      $$\mathcal{O}(x_0) = \setdef{x(t) : t \in I}.$$
properties:
  - >-
    The orbit of every state on an orbit is the same orbit, so two orbits are either disjoint or equal.
  - >-
    The orbit of an [equilibrium](/dictionary/definitions/equilibrium) is a single point.
  - >-
    The orbit of a nonconstant [periodic](/dictionary/definitions/periodic) solution is a closed curve, called a [periodic orbit](/dictionary/definitions/periodic-orbit).
---
The _forward orbit_ (or positive orbit) of $x_0$ uses only the times $t \geq 0$, and the _backward orbit_ uses only the times $t \leq 0$.

In group theory, the _orbit_ of a point $x$ under a group $G$ acting on a set is $\setdef{g \cdot x : g \in G}$.
The orbit of a dynamical system is the special case of the group $\reals$ of times acting on the states by the [flow](/dictionary/definitions/flow).
