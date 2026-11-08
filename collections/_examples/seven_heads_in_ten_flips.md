---
published: false
title: 'Seven heads in ten flips of a coin with unknown probability $\theta$ of heads'
level: undergraduate
values:
  probability: '$P(7 \text{ heads} \mid \theta = \frac{1}{2}) = \binom{10}{7} 2^{-10} \approx 0.117$'
  likelihood: '$L(\theta) = \binom{10}{7} \theta^7 (1 - \theta)^3$, maximized at $\theta = 0.7$'
why:
  probability: >-
    The probability of seven heads in ten flips is a number for a fixed coin, here a fair one, and it varies with the data for that fixed $\theta$.
  likelihood: >-
    The likelihood of $\theta$, given seven heads in ten flips, is the same formula viewed as a function of $\theta$ for the fixed data; it is largest at $\theta = 0.7$.
---
