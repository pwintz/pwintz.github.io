---
published: false
title: 'The rainfall on a day with a $\frac{1}{2}$ chance of no rain, and otherwise a uniform amount between $0$ and $10$ millimeters'
level: undergraduate
values:
  discrete_distribution: 'No'
  continuous_distribution: 'No'
  mixed_distribution: 'Yes: $\mu_X = \frac{1}{2} \delta_0 + \frac{1}{2} \operatorname{Uniform}[0, 10]$'
  singular_distribution: 'No'
why:
  discrete_distribution: >-
    The rainfall distribution is not discrete, because the amounts of rain between $0$ and $10$ millimeters form an uncountable range, and each single amount other than $0$ has probability $0$.
  continuous_distribution: >-
    The rainfall distribution is not continuous, because the single value $0$ has probability $\frac{1}{2}$.
  mixed_distribution: >-
    The rainfall distribution is mixed, because it puts probability $\frac{1}{2}$ on the single value $0$ and spreads the other $\frac{1}{2}$ by the density $\frac{1}{20}$ on $[0, 10]$.
  singular_distribution: >-
    The rainfall distribution is not singular, because the single value $0$ has positive probability.
---
