---
published: false
title: 'The running total $S_n$ after $n$ flips of a fair coin, adding $1$ for each heads and subtracting $1$ for each tails'
level: high-school
is: [
  stochastic_process,
  random_walk
]
is_not: [
  brownian_motion,
  gaussian_process
]
why:
  stochastic_process: >-
    The running total $S_n$ of coin flips is a stochastic process in discrete time, because $S_n$ is a random number for each $n$.
  random_walk: >-
    The running total $S_n$ of coin flips is the simple random walk, because $S_n$ is a sum of independent steps of $+1$ or $-1$, each with probability $\frac{1}{2}$.
  brownian_motion: >-
    The running total $S_n$ of coin flips is not a Brownian motion, because $S_n$ is defined only at whole numbers $n$, and $S_n$ is a whole number, not a normally distributed real number.
  gaussian_process: >-
    The running total $S_n$ of coin flips is not a Gaussian process, because $S_1$ equals $1$ or $-1$, so $S_1$ does not have a normal distribution.
---
