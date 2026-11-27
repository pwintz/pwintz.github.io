---
published: false
title: Riemann Integral
term: Riemann integral
applies_to: bounded functions on intervals
levels:
  undergraduate:
    text: |-
      Consider a [bounded](/dictionary/definitions/bounded) function $f : [a, b] \to \reals$.
      For a [partition](/dictionary/definitions/interval-partition) $a = x_0 < x_1 < \dots < x_n = b$ and points $t_k \in [x_{k-1}, x_k]$, the corresponding _Riemann sum_ is $\sum_{k = 1}^{n} f(t_k) (x_k - x_{k-1})$.
      The function $f$ is _Riemann integrable_, with _Riemann integral_ $I$, if the Riemann sums approach $I$ as the longest subinterval shrinks to $0$:

      $$\int_a^b f(x) \dx = \lim \sum_{k = 1}^{n} f(t_k) (x_k - x_{k-1}) = I.$$
    figure:
      widget: integral
      params: { riemann: true, b: 5.2 }
      aspect: 1 / 1
      caption: |-
        A Riemann sum of $f(x) = 1/2 + \sin x$ over $n$ equal subintervals of $[a, b]$, with the ends $x_k$ of the subintervals and the sample points $t_k$.
        Drag $a$ and $b$, and change $n$ with the slider.
      alt: The graph of one half plus sine of x over rectangles of a Riemann sum from a to b. A slider sets the number of rectangles, and a menu sets where each rectangle samples the function.
properties:
  - |-
    Every [continuous](/dictionary/definitions/continuous) function on $[a, b]$ is Riemann integrable.
  - |-
    A [bounded](/dictionary/definitions/bounded) function is Riemann integrable if and only if its set of discontinuities has [measure zero](/dictionary/definitions/measure-zero) (Lebesgue's criterion).
---
