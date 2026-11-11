---
title: Poisson vs. exponential distribution
kind: siblings
areas: [statistics]
summary: >
  Consider events that happen independently of each other at a constant average rate $\lambda$, such as customers arriving at a shop (a _Poisson process_).
  The [Poisson distribution](/dictionary/definitions/poisson-distribution) describes the _number_ of events in a fixed length of time, which is a whole number.
  The [exponential distribution](/dictionary/definitions/exponential-distribution) describes the _time_ until the next event, which is a positive real number.
terms:
  - poisson_distribution
  - exponential_distribution
examples:
  - example: emails_arriving_at_6_per_hour
    why: >-
      For emails arriving at $6$ per hour, "no email in the next $10$ minutes" is the same event as "zero emails in $10$ minutes" and "the wait is longer than $10$ minutes," so the Poisson and exponential distributions give the same probability $e^{-1}$.
  - example: customers_arriving_at_a_shop
    why: >-
      For customers arriving at $3$ per hour, the Poisson distribution gives the number of customers in an hour, with mean $3$, and the exponential distribution gives the wait until the first customer, with mean $\frac{1}{3}$ hour.
see_also:
  - common_probability_distributions
---
## Notes

- The two distributions are linked by $P(T > t) = P(N_t = 0) = e^{-\lambda t}$, where $N_t$ is the number of events in time $t$ and $T$ is the time of the first event.
- The Poisson distribution is [discrete](/dictionary/definitions/discrete-distribution), and the exponential distribution is [continuous](/dictionary/definitions/continuous-distribution).
- In a Poisson process, the mean number of events per unit of time is $\lambda$, and the mean time between events is $1 / \lambda$.
