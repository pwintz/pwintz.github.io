---
published: false
title: 'The standard Brownian motion $W_t$'
level: undergraduate
definition: brownian_motion
is: [
  stochastic_process,
  brownian_motion,
  gaussian_process
]
is_not: [random_walk]
why:
  stochastic_process: >-
    The standard Brownian motion $W_t$ is a stochastic process in continuous time, because $W_t$ is a random number for each time $t \geq 0$.
  random_walk: >-
    The standard Brownian motion $W_t$ is not a random walk, because a random walk moves in discrete steps, whereas $W_t$ moves continuously in continuous time.
    A Brownian motion is the limit of random walks with smaller and smaller steps.
  brownian_motion: >-
    The standard Brownian motion $W_t$ is a Brownian motion by definition.
  gaussian_process: >-
    The standard Brownian motion $W_t$ is a Gaussian process with mean $0$ and covariance $\operatorname{Cov}(W_s, W_t) = \min(s, t)$, because $(W_{t_1}, \dots, W_{t_n})$ is a linear function of the independent normal increments $W_{t_1}, W_{t_2} - W_{t_1}, \dots$, so this vector has a multivariate normal distribution.
---
