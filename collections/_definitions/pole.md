---
published: false
title: Pole of a transfer function
term: pole
applies_to: transfer functions
levels:
  high-school:
    text: |-
      A _pole_ of a [fraction](/definitions/fraction) of polynomials (after canceling common factors) is a value where the denominator is zero, so that the function blows up.
  undergraduate:
    text: |-
      A _pole_ of a transfer function $G(s)$ is a value of $s$ at which $G(s)$ is infinite: for a rational function, a root of the denominator after common factors are canceled.
properties:
  - >-
    For a minimal ([controllable](/definitions/controllable) and [observable](/definitions/observable)) realization $\dot{x} = A x + B u$, $y = C x + D u$, the poles of $G(s) = C (s I - A)^{-1} B + D$ are exactly the [eigenvalues](/definitions/eigenvalue) of $A$, with multiplicity.
  - >-
    A linear [time-invariant](/definitions/time-invariant) system is [BIBO stable](/definitions/bibo-stable) if and only if every pole of its transfer function has negative real part.
---
