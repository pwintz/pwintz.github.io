---
published: false
title: Probability measure vs. distribution vs. mass function vs. density vs. CDF
kind: siblings
areas: [statistics]
summary: >
  [Probability](/dictionary/definitions/probability) theory has several objects that describe how likely things are, and they are often used loosely as synonyms.
  A [probability measure](/dictionary/definitions/probability-measure) assigns probabilities to events, and the [distribution](/dictionary/definitions/probability-distribution) of a random variable is the probability measure it induces on its values.
  A distribution can be described by a [cumulative distribution function](/dictionary/definitions/cumulative-distribution-function), which every random variable has, and by a [probability mass function](/dictionary/definitions/probability-mass-function) for discrete [random variables](/dictionary/definitions/random-variable) or a [probability density](/dictionary/definitions/probability-density) for [continuous](/dictionary/definitions/continuous) ones.
terms:
  - probability_measure
  - probability_distribution
  - probability_mass_function
  - probability_density
  - cumulative_distribution_function
examples:
  - example: fair_die
    why: >-
      A die roll is discrete, so its distribution has a probability mass function but no density, and its CDF is a staircase.
  - example: uniform_random_number_on_0_1
    why: >-
      A uniform random number on $[0, 1]$ is continuous, so its distribution has a density but no probability mass function, and its CDF is continuous.
see_also:
  - random_variable_vs_event
  - probability_vs_likelihood
  - types_of_statistical_middles
---
## Notes

- The value $f(x)$ of a density is not a [probability](/dictionary/definitions/probability), and it can be larger than $1$; a value $p(x)$ of a mass function is a probability.
