---
published: false
title: Combination
term: combination
applies_to: selections of objects
synonyms: [unordered selection]
levels:
  high-school:
    text: |-
      Consider a set of $n$ objects and a number $k \leq n$.
      A _combination_ of $k$ of the $n$ objects is a selection of $k$ different objects from the set, in which the order of the objects does not matter.
  undergraduate:
    context: combinatorics
    text: |-
      Consider a set $S$ with $n$ elements and a number $k \leq n$.
      A _$k$-combination_ of $S$ is a [subset](/definitions/subset) of $S$ with $k$ elements.
properties:
  - |-
    The number of combinations of $k$ of $n$ objects is the binomial coefficient $\binom{n}{k}$, read "$n$ choose $k$":

    $$\binom{n}{k} = \frac{n!}{k! \, (n - k)!}.$$
  - >-
    Each combination of $k$ objects can be put in order in $k!$ ways, so $\binom{n}{k} = P(n, k) / k!$, where $P(n, k)$ is the number of [permutations](/definitions/permutation) of $k$ of $n$ objects.
  - >-
    The binomial coefficient $\binom{n}{k}$ is the coefficient of $x^k$ in $(1 + x)^n$.
---
The binomial coefficient $\binom{n}{k}$ is also written ${}_n C_k$ or $C(n, k)$.
