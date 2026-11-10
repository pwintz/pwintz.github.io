---
published: false
title: 'A stock price $S_t = 100 \exp(0.03 t + 0.2 W_t)$, in dollars, where $t$ is in years and $W$ is a standard Brownian motion'
level: undergraduate
is: [
  stochastic_process,
  geometric_brownian_motion
]
is_not: [
  brownian_motion,
  gaussian_process
]
why:
  stochastic_process: >-
    The stock price $S_t = 100 \exp(0.03 t + 0.2 W_t)$ is a stochastic process in continuous time, because $S_t$ is a random number for each time $t \geq 0$.
  brownian_motion: >-
    The stock price $S_t = 100 \exp(0.03 t + 0.2 W_t)$ is not a Brownian motion, because $S_0 = 100$ instead of $0$, and $S_t$ is positive for all $t$, whereas a Brownian motion takes negative values.
  geometric_brownian_motion: >-
    The stock price $S_t = 100 \exp(0.03 t + 0.2 W_t)$ is a geometric Brownian motion with starting value $S_0 = 100$, volatility $\sigma = 0.2$, and drift $\mu = 0.05$, because $\mu - \frac{1}{2} \sigma^2 = 0.05 - 0.02 = 0.03$.
  gaussian_process: >-
    The stock price $S_t = 100 \exp(0.03 t + 0.2 W_t)$ is not a Gaussian process, because each $S_t$, for $t > 0$, has a lognormal distribution, not a normal distribution.
---
