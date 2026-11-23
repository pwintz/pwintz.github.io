---
title: Cauchy–Schwarz Inequality
term: Cauchy–Schwarz inequality
applies_to: inner product spaces
synonyms: ['Cauchy–Bunyakovsky–Schwarz inequality', 'Schwarz inequality']
levels:
  high-school:
    text: |-
      The _Cauchy–Schwarz inequality_ states that the absolute value of the [dot product](/dictionary/definitions/dot-product) of two vectors $\vect{x}$ and $\vect{y}$ is at most the product of their lengths:

      $$\abs{\vect{x} \cdot \vect{y}} \le \norm{\vect{x}} \norm{\vect{y}}.$$
  undergraduate:
    text: |-
      Consider an [inner product space](/dictionary/definitions/inner-product-space) $V$ with [inner product](/dictionary/definitions/inner-product) $\ip{\cdot}{\cdot}$ and [norm](/dictionary/definitions/norm) $\norm{\vect{x}} = \sqrt{\ip{\vect{x}}{\vect{x}}}$.
      The _Cauchy–Schwarz inequality_ states that, for all $\vect{x}, \vect{y} \in V$,

      $$\abs{\ip{\vect{x}}{\vect{y}}} \le \norm{\vect{x}} \norm{\vect{y}},$$

      with equality if and only if $\vect{x}$ and $\vect{y}$ are linearly dependent.
properties:
  - |-
    For vectors in $\reals^n$, the inequality is

    $$\left( \sum_{i=1}^n x_i y_i \right)^2 \le \left( \sum_{i=1}^n x_i^2 \right) \left( \sum_{i=1}^n y_i^2 \right).$$
  - |-
    For the [$L^2$ inner product](/dictionary/definitions/l2-inner-product) of functions $f$ and $g$ on $[a, b]$, the inequality is

    $$\left\lvert \int_a^b f(t) g(t) \dt \right\rvert \le \sqrt{\int_a^b f(t)^2 \dt} \, \sqrt{\int_a^b g(t)^2 \dt}.$$

    So the $L^2$ inner product of $f$ and $g$ is finite if $\int_a^b f(t)^2 \dt$ and $\int_a^b g(t)^2 \dt$ are finite.
  - |-
    In a real [inner product space](/dictionary/definitions/inner-product-space), the inequality gives $-1 \le \ip{\vect{x}}{\vect{y}} / (\norm{\vect{x}} \norm{\vect{y}}) \le 1$ for nonzero $\vect{x}$ and $\vect{y}$, so the [angle](/dictionary/definitions/angle) $\theta$ between $\vect{x}$ and $\vect{y}$ can be defined by

    $$\cos \theta = \frac{\ip{\vect{x}}{\vect{y}}}{\norm{\vect{x}} \norm{\vect{y}}}.$$
  - >-
    The [triangle inequality](/dictionary/definitions/triangle-inequality) $\norm{\vect{x} + \vect{y}} \le \norm{\vect{x}} + \norm{\vect{y}}$ for the [norm](/dictionary/definitions/norm) of an [inner product](/dictionary/definitions/inner-product) follows from the Cauchy–Schwarz inequality.
---
