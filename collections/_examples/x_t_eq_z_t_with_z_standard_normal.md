---
published: false
title: 'The process $X_t = Z t$, for $t \geq 0$, where $Z$ is a standard normal random variable'
level: undergraduate
is: [
  stochastic_process,
  gaussian_process
]
is_not: [brownian_motion]
why:
  stochastic_process: >-
    The process $X_t = Z t$ is a stochastic process in continuous time, because $X_t$ is a random number for each time $t \geq 0$.
  gaussian_process: >-
    The process $X_t = Z t$ is a Gaussian process, because $(X_{t_1}, \dots, X_{t_n}) = Z (t_1, \dots, t_n)$ is a multiple of one normal random variable, so this vector has a multivariate normal distribution.
  brownian_motion: >-
    The process $X_t = Z t$ is not a Brownian motion, even though $X_0 = 0$ and each $X_t$ is normal, because the increments are not independent: the whole sample path is the straight line through the origin with the random slope $Z$.
---
