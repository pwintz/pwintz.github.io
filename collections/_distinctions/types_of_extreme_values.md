---
published: false
title: Types of extreme values
kind: family
areas: [analysis]
status: draft
summary: >
  The minimum and maximum of a set are its smallest and largest elements, if it has them.
  The infimum and supremum are the best lower and upper bounds, which exist for every nonempty bounded set of real numbers but need not be in the set.
  The limit inferior and limit superior of a sequence describe where its terms end up, ignoring any finite number of early terms.
relation: >
  For a bounded sequence, $\inf a_n \leq \liminf a_n \leq \limsup a_n \leq \sup a_n$.
terms:
  - minimum
  - maximum
  - infimum
  - supremum
  - liminf
  - limsup
examples:
  - example: set_3_5_8
    why: >-
      The minimum of $\lbrace 3, 5, 8 \rbrace$ is $3$ and the maximum is $8$.
      Every nonempty finite set has a minimum and a maximum, which equal its infimum and supremum.
  - example: interval_0_1_open_left
    why: >-
      The maximum of $(0, 1]$ is $1$, which equals the supremum.
      The infimum is $0$, but $0 \notin (0, 1]$, so there is no minimum.
  - example: one_for_interval_0_1_open_right
    why: >-
      $1$ is the supremum of $[0, 1)$ because it is the least upper bound.
      It is not the maximum, because $1 \notin [0, 1)$.
  - example: set_of_reciprocals
    why: >-
      The maximum of $S$ is $1$, which equals the supremum.
      The infimum is $0$, but $0 \notin S$, so $S$ has no minimum.
  - example: sequence_oscillating_shrinking
    why: >-
      The minimum and maximum of the terms, $-2$ and $\frac{3}{2}$, come from the first two terms, $a_1$ and $a_2$.
      The limit inferior and limit superior, $-1$ and $1$, ignore those early terms.
  - example: sequence_alternating
    why: >-
      The terms keep returning to $1$ and $-1$, so the limit superior is $1$ and the limit inferior is $-1$.
see_also:
  - types_of_extremal
  - types_of_limits
  - types_of_limits_of_functions
---
## Notes

- The limit superior is a limit of suprema: $\limsup_{n \to \infty} a_n = \lim_{n \to \infty} \sup_{k \geq n} a_k$.
  The limit inferior is the same with infima.
- For functions, "the maximum of $f$" can mean the largest value of $f$ or the input where it occurs.
  The input is better called a maximizer (see [minimizer](/definitions/minimizer)).
