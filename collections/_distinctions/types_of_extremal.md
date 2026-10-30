---
published: false
title: Minimum vs. lower bound vs. minimizer vs. infimum vs. minimal element
kind: family
areas: [analysis]
status: draft
summary: >
  A lower bound is below everything in the set. The infimum is the best lower bound, and it is a minimum only if it belongs to the set.
  A minimal element has nothing below it, which is weaker than being a minimum. A minimizer is an input where a function is smallest.
terms:
  - minimum
  - lower_bound
  - minimizer
  - infimum
  - minimal_element
examples:
  - example: minus_5_for_s_eq_0_1
    why: >-
      It is below every element, but $0$ is a better lower bound.
  - example: 0_for_s_eq_0_1
    why: >-
      The best lower bound, but $0 \notin S$, so $S$ has no minimum.
  - example: 1_for_s_eq_1_2
    why: >-
      The infimum belongs to the set.
  - example: set_1_in_the_collection_set_set_1_set_2_set_1_2
    why: >-
      No set in the collection is strictly contained in $\lbrace 1 \rbrace$, but $\lbrace 1 \rbrace \not\subseteq \lbrace 2 \rbrace$.
  - example: x_eq_0_for_f_x_eq_x_squared_plus_3
    why: >-
      The minimum value is $f(0) = 3$; $0$ is where it occurs.
  - example: 3_for_f_x_eq_x_squared_plus_3
    why: >-
      The smallest value of $f$.
see_also:
  - types_of_limits
  - types_of_finite
---
## Notes

- "Smallest" and "least" are synonyms for minimum. "The smallest closed set containing $A$" (the closure) is a minimum with respect to $\subseteq$, not just a minimal set.
- To _minimize_ $f$ is to find its minimum value or its minimizers. "Minimize" is the verb; "minimum" and "minimizer" are nouns.
- Everything on this page has a mirror image: upper bound, supremum, maximum, maximal element, and maximizer.
