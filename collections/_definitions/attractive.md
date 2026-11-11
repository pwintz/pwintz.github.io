---
published: false
title: Attractive equilibrium or set
term: attractive
applies_to: equilibria and sets
synonyms: [convergent, attracting]
levels:
  high-school:
    text: |-
      Consider a system with an [equilibrium](/dictionary/definitions/equilibrium), and the solutions that start near it.
      The equilibrium is _attractive_ if those solutions eventually approach it.
  undergraduate:
    context: equilibria
    text: |-
      Consider a system with an [equilibrium](/dictionary/definitions/equilibrium) $x^{\ast}$.
      The equilibrium is _attractive_ if there is $\delta > 0$ such that

      $$\norm{x(0) - x^{\ast}} < \delta \implies x(t) \to x^{\ast} \quad \text{as } t \to \infty.$$
  graduate:
    context: closed sets
    text: |-
      Consider a dynamical system and a [closed set](/dictionary/definitions/closed-set) $A$ of states.
      The set $A$ is _attractive_ if there is a [neighborhood](/dictionary/definitions/neighborhood) $U$ of $A$ such that every solution starting in $U$ converges to $A$: its distance to $A$ tends to zero.
properties:
  - >-
    Attractivity does not imply stability: solutions can make a large excursion before converging.
  - >-
    An [equilibrium](/dictionary/definitions/equilibrium) that is both stable and attractive is [asymptotically stable](/dictionary/definitions/asymptotically-stable).
---
