---
published: false
title: Linear regression
term: linear regression
applies_to: data
synonyms: [least squares regression]
levels:
  high-school:
    text: |-
      Consider data points $(x_1, y_1), \dots, (x_n, y_n)$.
      _Linear regression_ is the method of fitting a straight line $y = a + b x$ to the data points by choosing the numbers $a$ and $b$ that minimize the sum of the squared vertical distances from the data points to the line:

      $$\sum_{i = 1}^{n} \bigl(y_i - (a + b x_i)\bigr)^2.$$
  undergraduate:
    context: statistics
    text: |-
      Consider data $(x_1, y_1), \dots, (x_n, y_n)$, where each input $x_i \in \reals^d$ is a vector of features and each output $y_i$ is a [real number](/definitions/real-number).
      _Linear regression_ is the method of modeling each output as $y_i \approx \beta_0 + \beta^\top x_i$ and choosing the parameters $\beta_0 \in \reals$ and $\beta \in \reals^d$ that minimize the sum of squared errors:

      $$\sum_{i = 1}^{n} \bigl(y_i - \beta_0 - \beta^\top x_i\bigr)^2.$$
properties:
  - >-
    The word "linear" in linear regression refers to the parameters, not the inputs, so fitting a [polynomial](/definitions/polynomial) $y = \beta_0 + \beta_1 x + \beta_2 x^2$ by least squares is linear regression with the features $x$ and $x^2$.
  - >-
    If the matrix $X$ whose rows are $(1, x_i^\top)$ has [linearly independent](/definitions/linearly-independent) columns, then the least squares parameters are $(\beta_0, \beta) = (X^\top X)^{-1} X^\top y$.
  - >-
    Linear regression gives the [maximum likelihood estimate](/definitions/maximum-likelihood-estimator) of the parameters when the errors are independent and normally distributed with equal [variances](/definitions/variance).
---
