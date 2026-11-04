---
published: false
title: Exponentially stable equilibrium
term: exponentially stable
applies_to: equilibria
levels:
  high-school:
    text: |-
      Consider a system with an [equilibrium](/definitions/equilibrium), and the solutions that start near it.
      The equilibrium is _exponentially stable_ if those solutions approach it at least as fast as a decaying exponential, like $e^{-t}$.
  undergraduate:
    text: |-
      Consider a system with an [equilibrium](/definitions/equilibrium) $x^{\ast}$.
      The equilibrium is (locally) _exponentially stable_ if there are $k, \lambda, \delta > 0$ such that

      $$\lVert x(t) - x^{\ast} \rVert \leq k \lVert x(0) - x^{\ast} \rVert e^{-\lambda t}$$

      for all $t \geq 0$ whenever $\lVert x(0) - x^{\ast} \rVert < \delta$.
---
