---
published: false
title: Permutation
term: permutation
applies_to: arrangements of objects
synonyms: [arrangement, ordered selection]
levels:
  high-school:
    text: |-
      Consider a set of $n$ objects and a number $k \leq n$.
      A _permutation_ of $k$ of the $n$ objects is an ordered list of $k$ different objects from the set, in which the order of the objects matters.
  undergraduate:
    context: combinatorics
    text: |-
      Consider a set $S$ with $n$ elements and a number $k \leq n$.
      A _$k$-permutation_ of $S$ is an [injective](/definitions/injective) function

      $$\sigma : \setdef{1, \dots, k} \to S,$$

      which lists the elements $\sigma(1), \dots, \sigma(k)$ in order.
      A _permutation_ of $S$ is an $n$-permutation of $S$, which is the same as a [bijective](/definitions/bijective) function from $\setdef{1, \dots, n}$ to $S$.
properties:
  - |-
    The number of permutations of $k$ of $n$ objects is

    $$P(n, k) = n (n - 1) \cdots (n - k + 1) = \frac{n!}{(n - k)!}.$$
  - >-
    The number of permutations of all $n$ objects is $n!$.
---
In algebra, a _permutation_ of a set $S$ is a bijection from $S$ to $S$, and the permutations of $\setdef{1, \dots, n}$ form the symmetric group $S_n$.

The number $P(n, k)$ is also written ${}_n P_k$ or $n^{\underline{k}}$ (the falling factorial).
