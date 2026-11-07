---
published: false
title: Convergence in probability vs. in distribution
kind: hierarchy
areas: [statistics]
status: draft
summary: >
  A sequence of random variables $X_n$ can approach a random variable $X$ in several senses.
  Convergence in probability says that the random values $X_n$ themselves get close to $X$.
  Convergence in distribution says only that their probabilities approach those of $X$, so the values themselves may never settle down.
relation: >
  convergence in probability ⇒ convergence in distribution
terms:
  - convergence_in_probability
  - convergence_in_distribution
examples:
  - example: die_average_to_3_5
    why: >-
      The averages converge to $3.5$ in probability by the law of large numbers.
      So they also converge to $3.5$ in distribution.
  - example: coin_flips_vs_another_flip
    why: >-
      The flips $X_n$ converge to $X$ in distribution because every $X_n$ has the same distribution as $X$.
      They do not converge to $X$ in probability, because $P(\lvert X_n - X \rvert = 1) = \frac{1}{2}$ for every $n$.
  - example: standardized_die_average
    why: >-
      The standardized averages converge in distribution to a standard normal random variable by the central limit theorem.
      They do not converge in probability, because two of them, far apart in the sequence, are nearly independent, so they do not get close to each other.
see_also:
  - types_of_statistical_middles
  - types_of_limits
---
## Notes

- When the limit is a constant, such as $3.5$, the two kinds of convergence are equivalent.
- A third kind, almost sure convergence (convergence with probability $1$), is stronger than convergence in probability.
