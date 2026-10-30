---
published: false
title: Zero of a transfer function
term: zero (of a transfer function)
applies_to: transfer functions
synonyms: [transmission zero]
levels:
  high-school:
    text: |-
      A _zero_ of a [fraction](/definitions/fraction) of polynomials (after canceling common factors) is a value where the numerator is zero, so that the function is zero.
  undergraduate:
    text: |-
      A _zero_ of a transfer function $G(s)$ is a value of $s$ at which $G(s) = 0$: for a rational function, a root of the numerator after common factors are canceled.
properties:
  - >-
    If $z$ is a zero, the input $e^{z t}$ can be blocked completely: from a suitable initial state, the output is identically zero.
  - >-
    A system is minimum phase if all of its zeros have negative real part. Zeros in the right half-plane limit the performance that any controller can achieve.
---
For state-space systems, the _invariant zeros_ are the values of $s$ where the Rosenbrock system [matrix](/definitions/matrix) loses [rank](/definitions/matrix-rank). They include the transmission zeros and also any zeros canceled by uncontrollable or unobservable modes.
