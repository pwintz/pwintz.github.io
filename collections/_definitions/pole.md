---
published: false
title: Pole of a transfer function
term: pole
applies_to: transfer functions
levels:
  high-school:
    text: |-
      Consider a [fraction](/dictionary/definitions/fraction) of [polynomials](/dictionary/definitions/polynomial), after canceling common factors.
      A _pole_ of the fraction is a value where the denominator is zero, so that the function blows up.
  undergraduate:
    text: |-
      Consider a transfer function $G(s)$, a function of the complex variable $s$.
      A _pole_ of $G$ is a value of $s$ at which $G(s)$ is infinite: for a rational function, a root of the denominator after common factors are canceled.
properties:
  - >-
    For a minimal ([controllable](/dictionary/definitions/controllable) and [observable](/dictionary/definitions/observable)) realization $\dot{x} = A x + B u$, $y = C x + D u$, the poles of $G(s) = C (s I - A)^{-1} B + D$ are exactly the [eigenvalues](/dictionary/definitions/eigenvalue) of $A$, with multiplicity.
  - >-
    A linear [time-invariant](/dictionary/definitions/time-invariant) system is [BIBO stable](/dictionary/definitions/bibo-stable) if and only if every pole of its transfer function has negative real part.
---
