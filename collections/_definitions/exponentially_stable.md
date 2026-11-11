---
published: false
title: Exponentially stable equilibrium
term: exponentially stable
applies_to: equilibria
levels:
  high-school:
    text: |-
      Consider a system with an [equilibrium](/dictionary/definitions/equilibrium), and the solutions that start near it.
      The equilibrium is _exponentially stable_ if those solutions approach it at least as fast as a decaying exponential, like $e^{-t}$.
  undergraduate:
    text: |-
      Consider a system with an [equilibrium](/dictionary/definitions/equilibrium) $x^{\ast}$.
      The equilibrium is (locally) _exponentially stable_ if there are $k, \lambda, \delta > 0$ such that

      $$\norm{x(t) - x^{\ast}} \leq k \norm{x(0) - x^{\ast}} e^{-\lambda t}$$

      for all $t \geq 0$ whenever $\norm{x(0) - x^{\ast}} < \delta$.
---
