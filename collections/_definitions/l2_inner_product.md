---
published: false
title: $L^2$ inner product
term: L² inner product
applies_to: functions
synonyms: ['$\ip{f}{g}_{L^2}$', '$L^2$ inner product']
levels:
  undergraduate:
    text: |-
      Consider two real-valued functions $f$ and $g$ on an interval $[a, b]$ whose squares are integrable.
      The _$L^2$ inner product_ of $f$ and $g$ is

      $$\ip{f}{g} = \int_a^b f(t) g(t) \mathrm{d}t.$$
properties:
  - >-
    The $L^2$ [inner product](/definitions/inner-product) is the [continuous](/definitions/continuous) analog of the [dot product](/definitions/dot-product): the sum over entries becomes an integral over the interval.
  - >-
    Its [norm](/definitions/norm) $\norm{f} = \sqrt{\int_a^b f(t)^2 \mathrm{d}t}$ measures the size of $f$ on average, and two functions that differ only at finitely many points have distance $0$.
  - >-
    The functions $\sin(k t)$ for $k = 1, 2, \dots$ are orthogonal in the $L^2$ [inner product](/definitions/inner-product) on $[0, 2\pi]$, which is the [basis](/definitions/vector-basis) of Fourier series.
---
