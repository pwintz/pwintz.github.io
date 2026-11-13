---
title: 'Number of permutations vs. binomial coefficient'
kind: siblings
areas: [statistics, sets]
summary: |
  Many counting problems ask how many ways there are to choose $k$ different objects from a set of $n$ objects.
  If the order of the chosen objects matters, then the answer is the [number of permutations](/dictionary/definitions/number-of-permutations) $P(n, k)$, read "$n$ permute $k$":

  $$P(n, k) = \frac{n!}{(n - k)!}.$$

  If the order does not matter, then the answer is the [binomial coefficient](/dictionary/definitions/binomial-coefficient) $\binom{n}{k},$ read "$n$ choose $k$":

  $$\binom{n}{k} = \frac{n!}{k! \, (n - k)!}.$$

  Each [combination](/dictionary/definitions/combination) of $k$ objects can be put in order in $k!$ ways, so $P(n, k) = k! \binom{n}{k}$.
terms:
  - number_of_permutations
  - binomial_coefficient
examples_note: >-
  Each cell is the number of ways to make the choice in that row, counted with order (the number of permutations) or without order (the binomial coefficient).
examples:
  - example: choosing_2_of_the_letters_a_b_c
    why: >-
      Choosing $2$ of the letters $A$, $B$, $C$ gives twice as many permutations as combinations, because each combination of $2$ letters can be put in order in $2! = 2$ ways.
  - example: electing_a_president_and_a_vice_president_from_10_members
  - example: choosing_a_committee_of_2_from_10_members
  - example: drawing_6_lottery_numbers_from_49
see_also:
  - permutation_vs_combination
---
## Notes

- The number $P(n, k)$ is also written ${}_n P_k$ (read "$n$ P $k$," as on a calculator) or $n^{\underline{k}}$, the _falling factorial_ $n (n - 1) \cdots (n - k + 1)$, read "$n$ to the $k$ falling."
  The number $\binom{n}{k}$ is also written ${}_n C_k$ or $C(n, k)$.
- Both counts assume that each object is chosen at most once; choosing with repetition gives $n^k$ ordered choices and $\binom{n + k - 1}{k}$ unordered choices.
