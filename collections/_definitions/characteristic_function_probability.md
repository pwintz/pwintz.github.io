---
published: false
title: Characteristic function (probability)
term: characteristic function (probability)
applies_to: random variables
synonyms: ['$\varphi_X$']
levels:
  undergraduate:
    context: probability
    text: |-
      Consider a real [random variable](/dictionary/definitions/random-variable) $X$.
      The _characteristic function_ of $X$ is the function $\varphi_X : \reals \to \mathbb{C}$ defined by

      $$\varphi_X(t) = \mathbb{E}\bigl[e^{i t X}\bigr].$$
properties:
  - >-
    Every real [random variable](/dictionary/definitions/random-variable) has a characteristic function, because $\abs{e^{i t X}} = 1$, so the [expected value](/dictionary/definitions/expected-value) exists.
  - >-
    The characteristic function determines the [probability distribution](/dictionary/definitions/probability-distribution): two [random variables](/dictionary/definitions/random-variable) with the same characteristic function have the same distribution.
  - >-
    If $X$ and $Y$ are [independent](/dictionary/definitions/statistical-independence), then $\varphi_{X + Y} = \varphi_X \varphi_Y$.
  - >-
    If $X$ has a [probability density](/dictionary/definitions/probability-density) $\rho$, then $\varphi_X$ is the [Fourier transform](/dictionary/definitions/fourier-transform) of $\rho$, up to the sign and scaling of the frequency variable: $\varphi_X(t) = \int e^{i t x} \rho(x) \, \mathrm{d}x$.
---
In set theory and analysis, "characteristic function" means the [indicator function](/dictionary/definitions/indicator-function) of a set, which is a different object.
