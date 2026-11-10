---
published: false
title: 'The number $N_t$ of customers who have arrived at a shop by time $t$, when customers arrive independently of each other at an average rate of $3$ per hour'
level: undergraduate
is: [
  stochastic_process,
  poisson_process
]
is_not: [gaussian_process]
why:
  stochastic_process: >-
    The number $N_t$ of customers who have arrived by time $t$ is a stochastic process in continuous time, because $N_t$ is a random number for each time $t \geq 0$.
  poisson_process: >-
    The number $N_t$ of customers who have arrived by time $t$ is a Poisson process with rate $3$ per hour, because the customers arrive independently of each other at a constant average rate.
  gaussian_process: >-
    The number $N_t$ of customers who have arrived by time $t$ is not a Gaussian process, because $N_t$ is a whole number with a Poisson distribution, not a normal distribution.
---
