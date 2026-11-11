---
title: Continuously differentiable function
term: continuously differentiable
applies_to: functions
synonyms: [$C^1$]
levels:
  high-school:
    text: |-
      A function $f$ is called _continuously differentiable_ if the derivative $f^{\prime}$ exists at each point in the domain of $f$ and the derivative is itself a [continuous](/dictionary/definitions/continuous) function.
    caveat: >-
      Having a derivative everywhere is not enough.
      The function given by $f(x) = x^2 \sin(1/x)$ for $x \neq 0$ and $f(0) = 0$ is [differentiable](/dictionary/definitions/differentiable) everywhere, but its derivative is not [continuous](/dictionary/definitions/continuous) at $0$.
  undergraduate:
    context: functions on an open set $U \subseteq \reals^n$
    text: |-
      Consider a function $f : U \to \reals^m$ on an [open set](/dictionary/definitions/open-set) $U \subseteq \reals^n$.
      The function $f$ is _continuously differentiable_ if every [partial derivative](/dictionary/definitions/partial-derivative) of $f$ exists and is [continuous](/dictionary/definitions/continuous) on $U$.
properties:
  - >-
    A continuously differentiable function is locally [Lipschitz continuous](/dictionary/definitions/lipschitz-continuous), and it is Lipschitz continuous on every [compact](/dictionary/definitions/compact) convex [subset](/dictionary/definitions/subset) of its domain.
---
