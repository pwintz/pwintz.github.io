---
published: false
title: Correlation
term: correlation
applies_to: pairs of random variables and paired data
synonyms: [correlation coefficient, Pearson correlation, correlated]
levels:
  high-school:
    text: |-
      Consider two quantities measured together, such as the height and the weight of each person in a group.
      The quantities are _correlated_ if they tend to rise and fall together (positive correlation) or if one tends to rise when the other falls (negative correlation).
  undergraduate:
    text: |-
      Consider [random variables](/definitions/random-variable) $X$ and $Y$ with positive [standard deviations](/definitions/standard-deviation) $\sigma_X$ and $\sigma_Y$.
      The _correlation_ of $X$ and $Y$ is their [covariance](/definitions/covariance) scaled by the standard deviations:

      $$\rho(X, Y) = \frac{\operatorname{Cov}(X, Y)}{\sigma_X \sigma_Y}.$$

      The random variables $X$ and $Y$ are _uncorrelated_ if $\rho(X, Y) = 0$.
properties:
  - >-
    The correlation lies in $[-1, 1]$, and $\rho(X, Y) = \pm 1$ exactly when $Y = a X + b$ for constants $a \neq 0$ and $b$, with the sign of $a$.
  - >-
    Correlation measures only how close the relationship is to a straight line: if $X$ is uniform on $[-1, 1]$ and $Y = X^2$, then $\rho(X, Y) = 0$, although $Y$ is determined by $X$.
  - >-
    The correlation does not depend on the units of $X$ and $Y$, unlike the [covariance](/definitions/covariance).
---
