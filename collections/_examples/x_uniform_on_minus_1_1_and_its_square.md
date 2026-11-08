---
published: false
title: 'A random number $X$ uniform on $[-1, 1]$ and its square $Y = X^2$'
level: undergraduate
values:
  correlation: 'Uncorrelated: $\operatorname{Cov}(X, X^2) = \mathbb{E}[X^3] - \mathbb{E}[X] \, \mathbb{E}[X^2] = 0$'
  statistical_independence: 'Dependent'
why:
  correlation: >-
    For $X$ uniform on $[-1, 1]$, the random variables $X$ and $X^2$ are uncorrelated, because $\mathbb{E}[X] = 0$ and $\mathbb{E}[X^3] = 0$ by symmetry, so the covariance is $0$.
  statistical_independence: >-
    For $X$ uniform on $[-1, 1]$, the random variables $X$ and $X^2$ are dependent, because $X^2$ is determined by $X$: for example, $P(X > \frac{1}{2} \text{ and } X^2 < \frac{1}{4}) = 0$, but $P(X > \frac{1}{2}) \, P(X^2 < \frac{1}{4}) = \frac{1}{4} \cdot \frac{1}{2} = \frac{1}{8}$.
---
