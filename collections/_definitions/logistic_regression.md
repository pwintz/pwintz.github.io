---
published: false
title: Logistic regression
term: logistic regression
applies_to: data
levels:
  high-school:
    text: |-
      Consider data in which each input $x$ has an outcome of "yes" or "no," written $1$ or $0$.
      _Logistic regression_ is the method of modeling the [probability](/definitions/probability) of "yes" as the S-shaped function

      $$p(x) = \frac{1}{1 + e^{-(a + b x)}}$$

      and choosing the numbers $a$ and $b$ that make the observed outcomes as probable as possible.
  undergraduate:
    context: statistics
    text: |-
      Consider data $(x_1, y_1), \dots, (x_n, y_n)$, where each input $x_i \in \reals^d$ is a vector of features and each outcome $y_i$ is $0$ or $1$.
      _Logistic regression_ is the method of modeling the [probability](/definitions/probability) that $y_i = 1$ as

      $$p(x_i) = \sigma(\beta_0 + \beta^\top x_i), \qquad \text{where } \sigma(z) = \frac{1}{1 + e^{-z}},$$

      and choosing the parameters $\beta_0$ and $\beta$ that maximize the [likelihood](/definitions/likelihood) of the observed outcomes.
properties:
  - |-
    In logistic regression, the log-odds is a linear function of $x$:

    $$\ln \frac{p(x)}{1 - p(x)} = \beta_0 + \beta^\top x.$$
  - >-
    The log-likelihood of logistic regression is concave, but its maximizer has no closed-form formula, so the parameters are computed numerically.
  - >-
    Logistic regression is used for classification by predicting "yes" when $p(x) \geq \frac{1}{2}$, which happens when $\beta_0 + \beta^\top x \geq 0$.
---
Despite the name "regression," logistic regression is mostly used for classification.
