---
published: false
title: Permutation vs. combination
kind: siblings
areas: [statistics, sets]
summary: |
  Many counting problems ask how many ways there are to choose $k$ objects from a set of $n$ objects.
  If the order of the chosen objects matters, then each choice is a [permutation](/definitions/permutation), and the number of permutations is

  $$P(n, k) = \frac{n!}{(n - k)!}.$$

  If the order does not matter, then each choice is a [combination](/definitions/combination), and the number of combinations is the binomial coefficient, read "$n$ choose $k$":

  $$\binom{n}{k} = \frac{n!}{k! \, (n - k)!}.$$
terms:
  - permutation
  - combination
examples_note: >-
  Each cell is the number of ways to make the choice in that row, when the choice is of the column's kind.
examples:
  - example: choosing_2_of_the_letters_a_b_c
    why: >-
      Choosing $2$ of the letters $A$, $B$, $C$ gives twice as many permutations as combinations, because each combination of $2$ letters can be put in order in $2! = 2$ ways.
  - example: electing_a_president_and_a_vice_president_from_10_members
  - example: choosing_a_committee_of_2_from_10_members
  - example: drawing_6_lottery_numbers_from_49
---
## Notes

- Each [combination](/definitions/combination) of $k$ objects can be put in order in $k!$ ways, so $\binom{n}{k} = P(n, k) / k!$.
- The everyday word "combination," as in a "combination lock," usually means a [permutation](/definitions/permutation), because the order of the numbers matters.
- Both counts assume that each object is chosen at most once; choosing with repetition gives $n^k$ ordered choices and $\binom{n + k - 1}{k}$ unordered choices.
