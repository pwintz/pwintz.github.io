---
published: false
title: 'The probability that a coin favors heads ($\theta > \frac{1}{2}$), after seven heads in ten flips'
level: undergraduate
values:
  frequentist probability: 'Undefined, because $\theta$ is a fixed number'
  Bayesian probability: '$P(\theta > \tfrac{1}{2} \mid x) \approx 0.887$, from a uniform prior'
why:
  frequentist probability: >-
    In the frequentist interpretation, the statement "$\theta > \frac{1}{2}$" about the coin is either true or false, so it has no probability; a frequentist instead reports a test or a confidence interval.
  Bayesian probability: >-
    In the Bayesian interpretation, $\theta$ has the Beta(8, 4) posterior after seven heads in ten flips from a uniform prior, and the posterior assigns probability $232/2048 \approx 0.113$ to $\theta \leq \frac{1}{2}$.
---
