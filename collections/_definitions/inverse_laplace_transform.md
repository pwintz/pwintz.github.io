---
published: false
title: Inverse Laplace Transform
term: inverse Laplace transform
applies_to: functions
synonyms: ['$\mathcal{L}^{-1} F$']
levels:
  high-school:
    text: |-
      Consider a function $F(s)$ that is the [Laplace transform](/dictionary/definitions/laplace-transform) of a function of time.
      The _inverse Laplace transform_ of $F$ is the function of time $f(t)$ whose Laplace transform is $F$.
  undergraduate:
    text: |-
      Consider a function $F$ of a complex variable $s$.
      The _inverse Laplace transform_ of $F$ is the [continuous](/dictionary/definitions/continuous) function $f$ on $[0, \infty)$ such that

      $$\int_0^{\infty} f(t) e^{-s t} \dt = F(s)$$

      for every $s$ in a half-plane $\realpart{s} > a$.
properties:
  - |-
    If two [continuous](/dictionary/definitions/continuous) functions on $[0, \infty)$ have the same [Laplace transform](/dictionary/definitions/laplace-transform), then the two functions are equal (Lerch's theorem), so each function $F$ has at most one continuous inverse Laplace transform.
  - |-
    If $F$ is the [Laplace transform](/dictionary/definitions/laplace-transform) of $f$, then for every $t > 0$ at which $f$ is [continuous](/dictionary/definitions/continuous),

    $$f(t) = \frac{1}{2 \pi i} \int_{\gamma - i \infty}^{\gamma + i \infty} F(s) e^{s t} \diff{s},$$

    where the integral runs along the vertical line $\realpart{s} = \gamma$, and $\gamma$ is a [real number](/dictionary/definitions/real-number) that is greater than the real part of every [pole](/dictionary/definitions/pole) of $F$ (the Bromwich integral).
  - |-
    The inverse Laplace transform is linear, so the inverse Laplace transform of a ratio of [polynomials](/dictionary/definitions/polynomial) is usually found by splitting the ratio into partial fractions such as $1 / (s - p)$, whose inverse Laplace transform is $e^{p t}$.
  - |-
    The inverse Laplace transform of a [transfer function](/dictionary/definitions/transfer-function) is the output of the system when the input is a unit impulse at time $0$, which is called the _impulse response_ of the system.
---
