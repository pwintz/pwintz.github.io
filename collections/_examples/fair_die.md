---
title: 'The roll of a fair die'
level: high-school
values:
  discrete_distribution: 'Yes'
  continuous_distribution: 'No'
  mixed_distribution: 'No'
  singular_distribution: 'No'
  probability_mass_function: '$p(k) = \frac{1}{6}$ for $k = 1, \dots, 6$'
  cumulative_distribution_function: '$F(x) = \frac{\lfloor x \rfloor}{6}$ for $0 \leq x \leq 6$'
  # probability_density: 'None'
  expected_value: '$\mathbb{E}[X] = 3.5$'
  median: '$\frac{3 + 4}{2} = 3.5$'
  mode: 'Every outcome, $1$ through $6$'
  variance: '$\operatorname{Var}(X) = \mathbb{E}[X^2] - 3.5^2 = \frac{91}{6} - \frac{49}{4} = \frac{35}{12} \approx 2.92$'
  standard_deviation: '$\sqrt{35 / 12} \approx 1.71$'
why:
  expected_value: >-
    $\mathbb{E}[X] = \frac{1 + 2 + 3 + 4 + 5 + 6}{6} = 3.5$. Note: The expected value is not a possible outcome.
  mode: >-
    Every outcome is equally likely.
  median: >-
    The expected value and the median of a fair die roll are both $3.5$, which is not a possible outcome.
  probability_mass_function: >-
    The roll of a fair die has the probability mass function $p(k) = \frac{1}{6}$, because each of the $6$ outcomes is equally likely.
  cumulative_distribution_function: >-
    The cumulative distribution function of a fair die roll is a staircase, rising by $\frac{1}{6}$ at each of $1, 2, \dots, 6$, because $P(X \leq x)$ counts the outcomes at most $x$.
  # probability_density: >-
  #   The roll of a fair die has no probability density, because each single value has positive probability, and a density gives every single value probability $0$.
  discrete_distribution: >-
    The roll of a fair die has a discrete distribution, because the roll takes one of the $6$ values $1, 2, \dots, 6$.
  continuous_distribution: >-
    The roll of a fair die does not have a continuous distribution, because each of the values $1, \dots, 6$ has probability $\frac{1}{6}$.
  mixed_distribution: >-
    The roll of a fair die does not have a mixed distribution, because all of its probability is on single values.
  singular_distribution: >-
    The roll of a fair die does not have a singular distribution, because single values have positive probability.
---
