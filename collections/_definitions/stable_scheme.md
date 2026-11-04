---
published: false
title: Stable numerical scheme
term: stable (scheme)
applies_to: numerical schemes
levels:
  high-school:
    text: |-
      Consider a numerical method that solves a differential equation step by step, making small errors, such as rounding errors, along the way.
      The method is _stable_ if those errors do not grow out of control as it takes more steps.
  undergraduate:
    context: numerical analysis
    text: |-
      Consider a numerical scheme for a differential equation, and errors introduced at one step, from rounding or from the data.
      The scheme is _stable_ if those errors are not amplified without bound as the computation proceeds, uniformly as the step sizes tend to zero (over a fixed time interval).
---
This is different from the stability of an [equilibrium](/definitions/equilibrium) of a dynamical system, though the two are related.
