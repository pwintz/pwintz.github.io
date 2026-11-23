---
published: false
title: Transfer Function
term: transfer function
applies_to: linear time-invariant systems
synonyms: ['$G(s)$', '$H(s)$']
levels:
  undergraduate:
    text: |-
      Consider a linear, [time-invariant](/dictionary/definitions/time-invariant) system with input $u(t)$ and output $y(t)$ that starts at rest, with all initial conditions equal to zero.
      The _transfer function_ of the system is the ratio of the [Laplace transform](/dictionary/definitions/laplace-transform) $Y(s)$ of the output to the Laplace transform $U(s)$ of the input:

      $$G(s) = \frac{Y(s)}{U(s)}.$$
properties:
  - >-
    The transfer function does not depend on the input $u$.
  - >-
    The transfer function of a system described by a linear ordinary differential equation with constant coefficients is a ratio of [polynomials](/dictionary/definitions/polynomial) in $s$.
  - >-
    The _frequency response_ $G(i \omega)$ gives the [steady-state response](/dictionary/definitions/steady-state) to the input $\cos(\omega t)$: the output is $\abs{G(i \omega)} \cos(\omega t + \arg G(i \omega))$, if the system is stable.
  - >-
    The transfer function of two systems in series is the product of their transfer functions.
  - >-
    The [impedance](/dictionary/definitions/impedance) of a circuit is the transfer function from the current to the voltage, evaluated at $s = i \omega$.
---
