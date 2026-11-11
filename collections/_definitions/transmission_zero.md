---
title: Zero of a transfer function
term: zero (of a transfer function)
applies_to: transfer functions
synonyms: [transmission zero]
levels:
  high-school:
    text: |-
      Consider a [fraction](/dictionary/definitions/fraction) of [polynomials](/dictionary/definitions/polynomial), after canceling common factors.
      A _zero_ of the fraction is a value where the numerator is zero, so that the function is zero.
  undergraduate:
    text: |-
      Consider a transfer function $G(s)$, a function of the complex variable $s$.
      A _zero_ of $G$ is a value of $s$ at which $G(s) = 0$: for a rational function, a root of the numerator after common factors are canceled.
properties:
  - >-
    Suppose $z$ is a zero of $G$ such that $z$ is not a pole of $G$.
    Then there is an initial state such that the input $u(t) = e^{z t}$ produces the output $y(t) = 0$ for all $t \geq 0$.
    In this sense, the system blocks the input $e^{z t}$ completely.
  - >-
    A system is minimum phase if all of its zeros have negative real part.
    Zeros in the right half-plane limit the performance that any controller can achieve.
---
For state-space systems, the _invariant zeros_ are the values of $s$ where the Rosenbrock system [matrix](/dictionary/definitions/matrix) loses [rank](/dictionary/definitions/matrix-rank).
They include the transmission zeros and also any zeros canceled by uncontrollable or unobservable modes.
