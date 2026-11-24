---
title: $L^2$ Inner Product
term: L² inner product
applies_to: functions
synonyms: ['$\ip{f}{g}_{L^2}$', '$L^2$ inner product']
levels:
  undergraduate:
    text: |-
      Consider two real-valued functions $f$ and $g$ on an interval $[a, b]$ such that $\int_a^b f(t)^2 \dt$ and $\int_a^b g(t)^2 \dt$ are finite.
      The _$L^2$ inner product_ of $f$ and $g$ is

      $$\ip{f}{g} = \int_a^b f(t) g(t) \dt.$$
properties:
  - |-
    The $L^2$ [inner product](/dictionary/definitions/inner-product) is the [continuous](/dictionary/definitions/continuous) analog of the [dot product](/dictionary/definitions/dot-product): the sum over entries becomes an integral over the interval.
  - |-
    Its [norm](/dictionary/definitions/norm) $\norm{f} = \sqrt{\int_a^b f(t)^2 \dt}$ measures the size of $f$ on average, and two functions that differ only at finitely many points have distance $0$.
  - |-
    The functions $\sin(k t)$ for $k = 1, 2, \dots$ are [orthogonal](/dictionary/definitions/orthogonal-vectors) in the $L^2$ [inner product](/dictionary/definitions/inner-product) on $[0, 2\pi]$, which is the [basis](/dictionary/definitions/vector-basis) of Fourier series.
---

The condition that $\int_a^b f(t)^2 \dt$ and $\int_a^b g(t)^2 \dt$ are finite guarantees that the integral defining $\ip{f}{g}$ is finite.
This follows from the [Cauchy–Schwarz inequality](/dictionary/definitions/cauchy-schwarz-inequality):

$$\left\lvert \int_a^b f(t) g(t) \dt \right\rvert \le \sqrt{\int_a^b f(t)^2 \dt} \, \sqrt{\int_a^b g(t)^2 \dt}.$$

Without the condition, the inner product might not exist.
For example, the function $f(t) = 1/\sqrt{t}$ on $[0, 1]$ is integrable, but $f(t)^2 = 1/t$ is not, so $\ip{f}{f}$ is [infinite](/dictionary/definitions/infinite).
