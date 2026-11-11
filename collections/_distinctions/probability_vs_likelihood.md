---
published: false
title: Probability vs. likelihood
kind: siblings
areas: [statistics]
summary: >
  In everyday speech, "probability" and "likelihood" are synonyms, but in statistics they are different functions of the same formula $p(x \mid \theta)$.
  A [probability](/dictionary/definitions/probability) fixes the parameter $\theta$ and varies the data $x$, and it adds up to $1$ over the data.
  A [likelihood](/dictionary/definitions/likelihood) fixes the observed data $x$ and varies the parameter $\theta$, and it need not add up to $1$.
terms:
  - probability
  - likelihood
examples:
  - example: seven_heads_in_ten_flips
    why: >-
      The same expression $\binom{10}{7} \theta^7 (1 - \theta)^3$ is a probability when $\theta$ is fixed and a likelihood when the data are fixed.
see_also:
  - probability_measure_vs_distribution_vs_density
---
