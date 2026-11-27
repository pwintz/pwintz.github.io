---
title: Cumulative Distribution Function
term: cumulative distribution function
applies_to: random variables
synonyms: [CDF, distribution function]
levels:
  high-school:
    text: |-
      Consider a [random variable](/dictionary/definitions/random-variable) $X$ with real values.
      The _cumulative distribution function_ of $X$ gives, for each number $x$, the [probability](/dictionary/definitions/probability) that $X$ is at most $x$:

      $$F(x) = P(X \leq x).$$
    figure:
      widget: density
      params: { mode: cumulative }
      aspect: 1 / 1
      caption: |-
        Top: the [probability density](/dictionary/definitions/probability-density) $f$ of a standard [normal](/dictionary/definitions/normal-distribution) random variable $X$, shaded to the left of $x$ and labeled with its area.
        Bottom: the cumulative distribution function $F$ of $X$, with the point $(x, F(x))$ labeled with its height.
        Drag $x$.
      alt: Two plots. On top, the bell-shaped standard normal density, shaded to the left of a point x that can be dragged. Below, the S-shaped graph of its cumulative distribution function, with a dot at height F(x).
properties:
  - |-
    Every cumulative distribution function is nondecreasing and right-continuous, with $F(x) \to 0$ as $x \to -\infty$ and $F(x) \to 1$ as $x \to \infty$.
  - |-
    Every [random variable](/dictionary/definitions/random-variable) has a cumulative distribution function, even when it has neither a [probability mass function](/dictionary/definitions/probability-mass-function) nor a [probability density](/dictionary/definitions/probability-density).
  - |-
    If $X$ has a [probability density](/dictionary/definitions/probability-density) $f$, then $F(x)$ is the area under the graph of $f$ to the left of $x$:

    $$F(x) = \int_{-\infty}^{x} f(t) \dt.$$
  - |-
    If $X$ has a [continuous](/dictionary/definitions/continuous) probability density $f$, then $F$ is differentiable, and its derivative is the density:

    $$F^{\prime}(x) = f(x).$$
---
