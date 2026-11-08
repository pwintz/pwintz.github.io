---
published: false
title: Particle filter
term: particle filter
applies_to: state estimation
synonyms: [sequential Monte Carlo]
levels:
  high-school:
    text: |-
      A _particle filter_ estimates a changing quantity from noisy measurements by keeping many guesses of it, called _particles_.
      At each step, it moves each guess according to a model of how the quantity changes, with some randomness, gives more weight to the guesses that agree better with the new measurement, and then draws a new set of guesses that favors the heavily weighted ones.
  undergraduate:
    context: "discrete-time systems with noise"
    text: |-
      Consider a discrete-time system whose state $x_k$ evolves randomly according to a model $p(x_k \mid x_{k-1})$, and whose measured output $y_k$ has likelihood $p(y_k \mid x_k)$.
      A _particle filter_ for this system is a [filter](/definitions/filter-estimation) that approximates the probability distribution of $x_k$, given the measurements $y_1, \dots, y_k$, by $N$ samples $x_k^1, \dots, x_k^N$, called _particles_, with weights $\omega_k^1, \dots, \omega_k^N$.
      At each step, it draws each particle $x_k^i$ from $p(x_k \mid x_{k-1}^i)$, multiplies each weight by $p(y_k \mid x_k^i)$, rescales the weights to sum to $1$, and, when a few particles carry most of the weight, _resamples_: it draws $N$ new particles from the old ones with probabilities equal to their weights, and gives each new particle the weight $1 / N$.
properties:
  - >-
    Under mild conditions, the distribution represented by the particles converges to the true distribution of $x_k$ given the measurements as the number of particles $N \to \infty$.
  - >-
    A particle filter does not need the system to be linear or the noise to be Gaussian, and it can represent a distribution with several peaks, which a [Kalman filter](/definitions/kalman-filter) cannot.
  - >-
    The number of particles needed for a good approximation typically grows rapidly with the dimension of the state.
---
The state estimate is usually the [weighted average](/definitions/weighted-average) of the particles, $\hat{x}_k = \sum_i \omega_k^i x_k^i$.

The version described here, which draws particles from the model, is called the _bootstrap_ particle filter.
