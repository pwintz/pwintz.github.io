---
published: false
title: Types of extreme values
kind: family
areas: [analysis]
summary: >
  A set of [real numbers](/definitions/real-number) can have a largest and [smallest element](/definitions/minimum), or only bounds that it approaches.
  The minimum and maximum of a set are its smallest and [largest elements](/definitions/maximum), if it has them.
  The [infimum](/definitions/infimum) and [supremum](/definitions/supremum) are the best lower and upper bounds, which exist for every nonempty [bounded](/definitions/bounded) set of real numbers but need not be in the set.
  The [limit inferior](/definitions/liminf) and [limit superior](/definitions/limsup) of a sequence describe where its terms end up, ignoring any finite number of early terms.
relation:
  context: 'For a bounded sequence $(a_n)$:'
  relation: '$\inf a_n \leq \liminf a_n \leq \limsup a_n \leq \sup a_n$'
terms:
  - minimum
  - maximum
  - infimum
  - supremum
  - liminf
  - limsup
examples:
  - example: set_3_5_8
  - example: interval_0_1_open_left
    why: >-
      The infimum is $0$, but $0 \notin (0, 1]$, so there is no minimum.
  - example: one_for_interval_0_1_open_right
  - example: set_of_reciprocals
    why: >-
      The infimum is $0$, but $0 \notin S$, so $S$ has no minimum.
  - example: sequence_oscillating_shrinking
    why: >-
      The limit inferior and limit superior, $-1$ and $1$, ignore those early terms.
  - example: sequence_alternating
see_also:
  - types_of_extremal
  - types_of_limits
  - types_of_limits_of_functions
---
## Notes

- The [limit superior](/definitions/limsup) is a limit of suprema: $\limsup_{n \to \infty} a_n = \lim_{n \to \infty} \sup_{k \geq n} a_k$.
  The [limit inferior](/definitions/liminf) is the same with infima.
- For functions, "the maximum of $f$" can mean the largest value of $f$ or the input where it occurs.
  The input is better called a maximizer (see [minimizer](/definitions/minimizer)).
