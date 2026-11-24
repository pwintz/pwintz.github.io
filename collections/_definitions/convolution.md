---
published: false
title: Convolution
term: convolution
applies_to: functions and sequences
synonyms: ['$f \ast g$']
levels:
  high-school:
    text: |-
      Consider two lists of numbers $(a_0, a_1, \dots, a_m)$ and $(b_0, b_1, \dots, b_n)$.
      The _convolution_ of the two lists is the list $(c_0, c_1, \dots, c_{m + n})$ such that each entry $c_k$ is the sum of the products $a_j b_{k - j}$ for every $j$ such that both $a_j$ and $b_{k - j}$ are in the lists:

      $$c_k = \sum_{j} a_j b_{k - j}.$$
  undergraduate:
    text: |-
      Consider two functions $f : \reals \to \complexes$ and $g : \reals \to \complexes$ such that $\int_{-\infty}^{\infty} \abs{f(t)} \dt$ and $\int_{-\infty}^{\infty} \abs{g(t)} \dt$ are finite.
      The _convolution_ of $f$ and $g$ is the function $f \ast g$ defined by

      $$(f \ast g)(t) = \int_{-\infty}^{\infty} f(\tau) g(t - \tau) \diff{\tau}$$

      for each $t \in \reals$ such that the integral converges.
properties:
  - |-
    Convolution is [commutative](/dictionary/definitions/commutative) and [associative](/dictionary/definitions/associative): $f \ast g = g \ast f$, and $(f \ast g) \ast h = f \ast (g \ast h)$.
  - |-
    The coefficients of the product of two [polynomials](/dictionary/definitions/polynomial) are the convolution of the lists of coefficients of the two polynomials.
  - |-
    If $f$ and $g$ are zero for $t < 0$, as for signals that start at time $0$, then

    $$(f \ast g)(t) = \int_0^{t} f(\tau) g(t - \tau) \diff{\tau}.$$
  - |-
    The [Laplace transform](/dictionary/definitions/laplace-transform) of a convolution is the product of the Laplace transforms:

    $$\mathcal{L}(f \ast g) = (\mathcal{L} f) (\mathcal{L} g).$$

    The same is true for the [Fourier transform](/dictionary/definitions/fourier-transform).
    (The convolution theorem.)
  - |-
    The output of a linear, [time-invariant](/dictionary/definitions/time-invariant) system that starts at rest is the convolution of the input with the _impulse response_ of the system, which is the [inverse Laplace transform](/dictionary/definitions/inverse-laplace-transform) of the [transfer function](/dictionary/definitions/transfer-function).
---
