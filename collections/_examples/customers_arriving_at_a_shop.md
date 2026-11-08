---
title: 'Customers arriving at a shop independently of each other at an average rate of $3$ per hour'
level: undergraduate
values:
  uniform_distribution: 'If exactly one customer arrives between 1:00 and 2:00, then the arrival time: uniform on that hour'
  bernoulli_distribution: 'Whether at least one customer arrives in an hour: Bernoulli with $p = 1 - e^{-3} \approx 0.950$'
  poisson_distribution: 'The number of customers in an hour: Poisson with mean $3$'
  exponential_distribution: 'The waiting time, in hours, until the first customer: exponential with rate $3$'
  normal_distribution: 'The number of customers in $100$ hours: approximately $\mathcal{N}(300, 300)$'
why:
  uniform_distribution: >-
    For customers arriving independently at a constant rate, if exactly one customer arrives in a given hour, then the customer is equally likely to arrive at each time in that hour, so the arrival time has a uniform distribution on the hour.
  bernoulli_distribution: >-
    For customers arriving at an average rate of $3$ per hour, the indicator that at least one customer arrives in an hour has a Bernoulli distribution with success probability $1 - P(\text{no customers}) = 1 - e^{-3}$.
  poisson_distribution: >-
    For customers arriving independently at an average rate of $3$ per hour, the number of customers in an hour has a Poisson distribution with mean $3$, because the number counts independent events at a constant rate.
  exponential_distribution: >-
    For customers arriving independently at an average rate of $3$ per hour, the waiting time until the first customer has an exponential distribution with rate $3$, so the expected wait is $\frac{1}{3}$ hour, or $20$ minutes.
  normal_distribution: >-
    For customers arriving at an average rate of $3$ per hour, the number of customers in $100$ hours is Poisson with mean $300$, which is approximately normal with mean $300$ and variance $300$ by the central limit theorem.
---
