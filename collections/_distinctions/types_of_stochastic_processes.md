---
published: false
title: Types of stochastic processes
kind: family
areas: [statistics]
summary: >
  A [stochastic process](/definitions/stochastic-process) is a quantity that changes randomly over time, and a few kinds of stochastic processes appear again and again.
  A [random walk](/definitions/random-walk) moves in discrete time by adding independent random steps.
  A [Poisson process](/definitions/poisson-process) counts events that happen independently at a constant rate, so the Poisson process jumps up by $1$ at random times.
  A [Brownian motion](/definitions/brownian-motion) moves continuously in continuous time, with independent, normally distributed changes.
  A [geometric Brownian motion](/definitions/geometric-brownian-motion) is the exponential of a Brownian motion with drift, so its changes are proportional to its value, and the value stays positive.
  A [Gaussian process](/definitions/gaussian-process) is a process whose values at every finite list of times are jointly normal, which is a property that many processes share, not one particular process.
terms:
  - stochastic_process
  - random_walk
  - poisson_process
  - brownian_motion
  - geometric_brownian_motion
  - gaussian_process
examples:
  - example: adding_1_for_each_heads_and_subtracting_1_for_each_tails
  - example: the_number_of_customers_who_have_arrived_by_time_t
  - example: standard_brownian_motion
  - example: a_stock_price_modeled_by_geometric_brownian_motion
  - example: x_t_eq_z_t_with_z_standard_normal
    why: >-
      The process $X_t = Z t$ is a Gaussian process but not a Brownian motion, so being a Gaussian process with $X_0 = 0$ does not make a process a Brownian motion; the independence of the increments is also needed.
see_also:
  - markov_chain_vs_markov_decision_process
  - poisson_vs_exponential
  - common_probability_distributions
---
## Notes

- [Random walks](/definitions/random-walk), [Poisson processes](/definitions/poisson-process), [Brownian motions](/definitions/brownian-motion), and [geometric Brownian motions](/definitions/geometric-brownian-motion) are all Markov processes: the future depends on the past only through the present value.
- Other common [stochastic processes](/definitions/stochastic-process) include white noise, the Ornstein–Uhlenbeck process (a Brownian motion pulled back toward a mean, which is a Gaussian and Markov process), Lévy processes (which generalize the Poisson process and Brownian motion), and martingales (processes whose expected future value equals their present value).
