---
title: Number of permutations
term: number of permutations
applies_to: counting
synonyms: ['$P(n, k)$', '${}_n P_k$', falling factorial]
levels:
  high-school:
    text: |-
      Consider [integers](/dictionary/definitions/integer) $n$ and $k$ such that $0 \leq k \leq n$.
      The _number of permutations_ $P(n, k)$, read "$n$ permute $k$," is the number of [permutations](/dictionary/definitions/permutation) of $k$ of $n$ objects, that is, the number of ordered lists of $k$ different objects chosen from $n$ objects:

      $$P(n, k) = n (n - 1) \cdots (n - k + 1) = \frac{n!}{(n - k)!}.$$
properties:
  - >-
    The product $n (n - 1) \cdots (n - k + 1)$ counts the choices one position at a time: there are $n$ choices for the first object, $n - 1$ for the second, and so on, down to $n - k + 1$ for the $k$th.
  - >-
    The number of permutations of all $n$ objects is $P(n, n) = n!$.
  - |-
    Each [combination](/dictionary/definitions/combination) of $k$ objects can be put in order in $k!$ ways, so $P(n, k)$ is $k!$ times the [binomial coefficient](/dictionary/definitions/binomial-coefficient):

    $$P(n, k) = k! \binom{n}{k}.$$
---
The number $P(n, k)$ is also written ${}_n P_k$ (read "$n$ P $k$," as on a calculator) or $n^{\underline{k}}$, the _falling factorial_, read "$n$ to the $k$ falling."
