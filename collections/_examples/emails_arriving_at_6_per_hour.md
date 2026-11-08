---
title: 'Emails arriving independently of each other at an average rate of $6$ per hour, and the event that no email arrives in the next $10$ minutes'
level: undergraduate
values:
  poisson_distribution: 'The number $N$ of emails in $10$ minutes is Poisson with mean $1$, so $P(N = 0) = e^{-1} \approx 0.368$'
  exponential_distribution: 'The waiting time $T$, in minutes, until the next email is exponential with rate $\frac{1}{10}$ per minute, so $P(T > 10) = e^{-1} \approx 0.368$'
why:
  poisson_distribution: >-
    For emails arriving at $6$ per hour, the number of emails in $10$ minutes is a count in a fixed time, so the number has a Poisson distribution with mean $6 \cdot \frac{10}{60} = 1$.
  exponential_distribution: >-
    For emails arriving at $6$ per hour, the waiting time until the next email is a continuous time, so the waiting time has an exponential distribution with mean $10$ minutes.
---
