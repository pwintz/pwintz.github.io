---
published: false
title: 'A standard normal random variable $X$'
detail: |-
  A standard normal random variable $X$ is a [normal](/dictionary/definitions/normal-distribution) [random variable](/dictionary/definitions/random-variable) with mean $0$ and variance $1$.
  Its [probability density](/dictionary/definitions/probability-density) is the bell-shaped function

  $$f(x) = \frac{1}{\sqrt{2\pi}} e^{-x^2/2},$$

  so the probability that $X$ lies between $a$ and $b$ is the area under the graph of $f$ from $a$ to $b$:

  $$P(a \leq X \leq b) = \int_a^b \frac{1}{\sqrt{2\pi}} e^{-x^2/2} \dx.$$

  This integral has no elementary formula, so its values are found numerically.
  About $68\%$ of the probability lies within $1$ of the mean, in $[-1, 1]$, and about $95\%$ within $2$, in $[-2, 2]$.
level: undergraduate
figure:
  widget: density
  caption: |-
    The probability density $f$ of $X$, with the area for $P(a \leq X \leq b)$ shaded.
    Drag $a$ and $b$.
  alt: The bell-shaped graph of the standard normal density, with the area under it shaded between a and b, which can be dragged.
values:
  discrete_distribution: 'No'
  continuous_distribution: 'Yes'
  mixed_distribution: 'No'
  singular_distribution: 'No'
  probability_density: '$f(x) = e^{-x^2/2} / \sqrt{2\pi}$'
  cumulative_distribution_function: '$F(x) = \int_{-\infty}^{x} e^{-t^2/2} / \sqrt{2\pi} \, \dt$, which has no elementary formula'
  probability_mass_function: 'None'
why:
  probability_density: >-
    A standard normal random variable $X$ has the bell-shaped density $f(x) = e^{-x^2/2} / \sqrt{2\pi}$, so the probability $P(a \leq X \leq b)$ is the area under the graph of $f$ from $a$ to $b$.
  cumulative_distribution_function: >-
    The cumulative distribution function of a standard normal random variable $X$ is $F(x) = P(X \leq x)$, the area under its density to the left of $x$.
  probability_mass_function: >-
    A standard normal random variable has no probability mass function, because every single value has probability $0$.
  discrete_distribution: >-
    A standard normal random variable does not have a discrete distribution, because every single value has probability $0$.
  continuous_distribution: >-
    A standard normal random variable has a continuous distribution, with density $f(x) = e^{-x^2/2} / \sqrt{2\pi}$.
  mixed_distribution: >-
    A standard normal random variable does not have a mixed distribution, because no single value has positive probability.
  singular_distribution: >-
    A standard normal random variable does not have a singular distribution, because every set of length $0$ has probability $0$.
---
