---
title: Probability density function
term: probability density
applies_to: continuous random variables
synonyms: [probability density function, PDF, density]
levels:
  undergraduate:
    text: |-
      Consider a [random variable](/definitions/random-variable) $X$ with real values.
      A function $f \geq 0$ is a _probability density_ of $X$ if probabilities are areas under the graph of $f$:

      $$P(a \leq X \leq b) = \int_a^b f(x) \mathrm{d}x \quad \text{for all } a \leq b.$$
properties:
  - >- 
    The integral of every probability density $f(x)$ over its domain is 1:

    $$\int_{-\infty}^\infty f(x) \mathrm{d}x = 1.$$
  - >-
    A density can be greater than $1$: the [uniform distribution](/definitions/uniform-distribution) on $[0, \frac{1}{2}]$ has density $2$.
    The value $f(x)$ is not a [probability](/definitions/probability); only integrals of $f$ are.
  - >-
    For a continuous [random variable](/definitions/random-variable), any individual value has [probability](/definitions/probability) $0$.
---
