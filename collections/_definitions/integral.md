---
published: false
title: Integral
term: integral
applies_to: functions
synonyms: ['$\int_a^b f(x) \mathrm{d}x$', definite integral]
levels:
  high-school:
    text: |-
      Consider a function $f$ on an interval $[a, b]$ whose graph lies above the $x$-axis.
      The _integral_ of $f$ from $a$ to $b$, written $\int_a^b f(x) \mathrm{d}x$, is the area of the region between the graph and the $x$-axis.
    caveat: >-
      Where $f$ is negative, the area below the $x$-axis counts as negative.
      Making "area" precise for general functions leads to the [Riemann integral](/dictionary/definitions/riemann-integral) and the [Lebesgue integral](/dictionary/definitions/lebesgue-integral).
properties:
  - >-
    By the fundamental theorem of calculus, if $F^{\prime} = f$ on $[a, b]$ and $f$ is [continuous](/dictionary/definitions/continuous), then $\int_a^b f(x) \mathrm{d}x = F(b) - F(a)$.
---
An _indefinite integral_ $\int f(x) \mathrm{d}x$ is an [antiderivative](/dictionary/definitions/antiderivative) of $f$, a function rather than a number.
