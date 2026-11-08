---
published: false
title: 'Rolling a fair die repeatedly'
level: high-school
values:
  uniform_distribution: 'Each roll: uniform on $\setdef{1, 2, 3, 4, 5, 6}$'
  bernoulli_distribution: 'Whether a roll is a six: Bernoulli with $p = \frac{1}{6}$'
  binomial_distribution: 'The number of sixes in the first $12$ rolls: binomial with $n = 12$ and $p = \frac{1}{6}$'
  geometric_distribution: 'The number of rolls until the first six: geometric with $p = \frac{1}{6}$'
  normal_distribution: 'The average of the first $100$ rolls: approximately $\mathcal{N}(3.5, \frac{35}{1200})$'
why:
  uniform_distribution: >-
    When a fair die is rolled, each roll has a uniform distribution, because each of the $6$ faces has the same probability $\frac{1}{6}$.
  bernoulli_distribution: >-
    When a fair die is rolled, the indicator that a roll is a six has a Bernoulli distribution, because the indicator equals $1$ with probability $\frac{1}{6}$ and $0$ otherwise.
  binomial_distribution: >-
    When a fair die is rolled $12$ times, the number of sixes has a binomial distribution, because the number of sixes counts the successes in $12$ independent trials with success probability $\frac{1}{6}$; the expected number is $2$.
  geometric_distribution: >-
    When a fair die is rolled repeatedly, the number of rolls up to and including the first six has a geometric distribution, because the number counts the trials until the first success; the expected number is $6$.
  normal_distribution: >-
    When a fair die is rolled $100$ times, the average roll is approximately normal by the central limit theorem, with mean $3.5$ and variance $\frac{35/12}{100} = \frac{35}{1200}$; the average is exactly normal for no number of rolls, because the average takes only finitely many values.
---
