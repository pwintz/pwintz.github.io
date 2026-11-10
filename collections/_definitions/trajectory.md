---
published: false
title: Trajectory
term: trajectory
applies_to: dynamical systems
synonyms: [solution]
levels:
  high-school:
    text: |-
      Consider a system whose state changes over time according to a rule.
      A _trajectory_ of the system is a function $x(t)$ that gives the state of the system at each time $t$ and obeys the rule.
  undergraduate:
    context: ordinary differential equations
    text: |-
      Consider a dynamical system $\dot{x} = f(x)$ on $\reals^n$.
      A _trajectory_ of the system is a [differentiable](/definitions/differentiable) function $x : I \to \reals^n$, defined on an interval $I$, such that

      $$\dot{x}(t) = f\bigl(x(t)\bigr) \quad \text{for all } t \in I.$$
properties:
  - >-
    The image of a trajectory $x$, without the times, is the [orbit](/definitions/orbit) of the starting point (if $x$ is a maximal solution).
  - >-
    If $f$ is [locally Lipschitz continuous](/definitions/locally-lipschitz-continuous), then two trajectories that pass through the same state at the same time are equal on their common interval.
---
Some authors use "trajectory" for the set of states that a solution passes through, which this dictionary calls the [orbit](/definitions/orbit).
In control theory, a trajectory often includes the input as well as the state: a pair of functions $(x, u)$ that satisfies $\dot{x} = f(x, u)$.
