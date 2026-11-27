---
published: false
title: Integral
term: integral
applies_to: functions
synonyms: ['$\int_a^b f(x) \dx$', definite integral]
levels:
  high-school:
    text: |-
      Consider a function $f$ on an interval $[a, b]$ whose graph lies above the $x$-axis.
      The _integral_ of $f$ from $a$ to $b$, written $\int_a^b f(x) \dx$, is the area of the region between the graph and the $x$-axis.
    caveat: >-
      Where $f$ is negative, the area below the $x$-axis counts as negative.
      Making "area" precise for general functions leads to the [Riemann integral](/dictionary/definitions/riemann-integral) and the [Lebesgue integral](/dictionary/definitions/lebesgue-integral).
    figure:
      widget: integral
      caption: |-
        The graph of $f(x) = 1/2 + \sin x$, with the area between the graph and the $x$-axis from $a$ to $b$ shaded: blue above the axis and orange below it.
        Drag $a$ and $b$.
      alt: The graph of one half plus sine of x, with the region between the graph and the x-axis shaded from a to b, blue above the axis and orange below it. The endpoints a and b can be dragged.
properties:
  - |-
    By the fundamental theorem of calculus, if $F^{\prime} = f$ on $[a, b]$ and $f$ is [continuous](/dictionary/definitions/continuous), then 
    
    $$\int_a^b f(x) \dx = F(b) - F(a).$$
---
An _indefinite integral_ $\int f(x) \dx$ is an [antiderivative](/dictionary/definitions/antiderivative) of $f$, a function rather than a number.
