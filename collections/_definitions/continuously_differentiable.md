---
published: false
title: Continuously differentiable function
term: continuously differentiable
applies_to: functions
synonyms: [$C^1$]
levels:
  high-school:
    text: |-
      A function $f$ is _continuously differentiable_ if it has a derivative at every point of its domain, and the derivative $f^{\prime}$ is itself a [continuous](/definitions/continuous) function.
    caveat: >-
      Having a derivative everywhere is not enough. The function given by $f(x) = x^2 \sin(1/x)$ for $x \neq 0$ and $f(0) = 0$ is [differentiable](/definitions/differentiable) everywhere, but its derivative is not [continuous](/definitions/continuous) at $0$.
  undergraduate:
    context: functions on an open set $U \subseteq \reals^n$
    text: |-
      A function $f : U \to \reals^m$ is _continuously differentiable_ if every [partial derivative](/definitions/partial-derivative) of $f$ exists and is [continuous](/definitions/continuous) on $U$.
properties:
  - >-
    A continuously differentiable function is locally [Lipschitz continuous](/definitions/lipschitz-continuous), and it is Lipschitz continuous on every [compact](/definitions/compact) convex [subset](/definitions/subset) of its domain.
---
