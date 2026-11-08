---
published: false
title: Convergence in probability vs. in distribution
kind: hierarchy
areas: [statistics]
summary: >
  A sequence of [random variables](/definitions/random-variable) $X_n$ can approach a random variable $X$ in several senses.
  [Convergence in probability](/definitions/convergence-in-probability) says that the random values $X_n$ themselves get close to $X$.
  [Convergence in distribution](/definitions/convergence-in-distribution) says only that their probabilities approach those of $X$, so the values themselves may never settle down.
relation: >
  convergence in probability ⇒ convergence in distribution
terms:
  - convergence_in_probability
  - convergence_in_distribution
examples:
  - example: die_average_to_3_5
  - example: coin_flips_vs_another_flip
  - example: standardized_die_average
see_also:
  - types_of_statistical_middles
  - types_of_limits
---
## Notes

- When the limit is a constant, such as $3.5$, the two kinds of convergence are equivalent.
- A third kind, almost sure convergence (convergence with [probability](/definitions/probability) $1$), is stronger than [convergence in probability](/definitions/convergence-in-probability).
