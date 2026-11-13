---
title: Permutation vs. combination
kind: siblings
areas: [statistics, sets]
summary: >
  Many counting problems choose $k$ different objects from a set of $n$ objects, and the result is either a permutation or a combination.
  A [permutation](/dictionary/definitions/permutation) is an ordered list of the chosen objects, so $(A, B)$ and $(B, A)$ are different permutations.
  A [combination](/dictionary/definitions/combination) is the set of the chosen objects, with no order, so $\setdef{A, B}$ and $\setdef{B, A}$ are the same combination.
  For the numbers of permutations and combinations, see [$P(n, k)$ vs. $\binom{n}{k}$](/dictionary/distinctions/number-of-permutations-vs-binomial-coefficient).
terms:
  - permutation
  - combination
examples:
  - example: the_ordered_list_a_b_from_a_b_c
  - example: the_set_a_b_from_a_b_c
    why: >-
      The set $\setdef{A, B}$ is one combination, but the same two letters form two permutations, $(A, B)$ and $(B, A)$.
  - example: electing_a_president_and_a_vice_president_from_10_members
  - example: choosing_a_committee_of_2_from_10_members
  - example: drawing_6_lottery_numbers_from_49
see_also:
  - number_of_permutations_vs_binomial_coefficient
---
## Notes

- The everyday word "combination," as in a "combination lock," usually means a [permutation](/dictionary/definitions/permutation), because the order of the numbers matters.

A combination is written as a set, like $\{A, B, C\}$, because the order does not matter, whereas a permutation is written as a list or a tuple, like $(A, B, C)$ or $(C, B, A)$ because the order does matter.