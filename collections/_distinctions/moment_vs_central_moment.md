---
title: Moment vs. central moment
kind: siblings
areas: [statistics]
summary: >
  In statistics, moments and central moments each summarize the shape of a [probability distribution](/dictionary/definitions/probability-distribution) by averaging powers.
  The $k$th [moment](/dictionary/definitions/statistical-moment) $\mathbb{E}[X^k]$ of a [random variable](/dictionary/definitions/random-variable) $X$ averages powers of $X$ itself, measured from $0$.
  The $k$th [central moment](/dictionary/definitions/central-moment) $\mathbb{E}[(X - \mu)^k]$ averages powers of the deviation of $X$ from its mean $\mu$, so central moments do not change when a constant is added to $X$.
  The moments and the central moments of $X$ agree when the mean of $X$ is $0$.
examples_note: >-
  Each cell is the $k$th ___ of the random variable in that row.
terms:
  - statistical_moment
  - central_moment
examples:
  - example: fair_die_first_moments
  - example: fair_die_second_moments
    why: >-
      The second central moment of a fair die roll is its variance, $35/12$, which is much smaller than its second moment, $91/6$, because the rolls are spread around $7/2$, not around $0$.
  - example: fair_die_third_moments
  - example: standard_normal_second_moments
  - example: normal_mean_3_second_moments
    why: >-
      Shifting a standard normal random variable by $3$ changes its second moment from $1$ to $10$ but leaves its second central moment, the variance, equal to $1$.
see_also:
  - variance_vs_standard_deviation
  - types_of_statistical_middles
---
## Notes

- The second central moment is the [variance](/dictionary/definitions/variance), and the first central moment of every [random variable](/dictionary/definitions/random-variable) with a mean is $0$.
- The moments of a data set, called sample moments, average the powers of the data values, and the sample [central moments](/dictionary/definitions/central-moment) average the powers of the deviations from the sample mean.
