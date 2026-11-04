---
published: false
title: Consistent numerical scheme
term: consistent
applies_to: numerical schemes
levels:
  high-school:
    text: |-
      Consider a numerical method that approximates a differential equation by taking small steps.
      The method is _consistent_ if each of its steps approximates the equation better and better as the step size shrinks.
  undergraduate:
    context: numerical analysis
    text: |-
      Consider a numerical scheme for a differential equation, with its local truncation error: how far the exact solution is from satisfying the discrete equations.
      The scheme is _consistent_ if this error tends to zero as the step sizes tend to zero.
---
