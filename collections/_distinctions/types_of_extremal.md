---
published: false
title: Minimum vs. lower bound vs. minimizer vs. infimum vs. minimal element
kind: family
areas: [analysis]
status: draft
summary: >
  Several terms describe the "smallest" element of a set or the "best" point for a function.
  A lower bound is below everything in the set.
  The infimum is the best lower bound, and it is a minimum only if it belongs to the set.
  A minimal element has nothing below it, which is weaker than being a minimum.
  A minimizer is an input where a function is smallest.
terms:
  - minimum
  - lower_bound
  - minimizer
  - infimum
  - minimal_element
examples:
  - example: minus_5_for_s_eq_0_1
    why: >-
      $-5$ is a lower bound of $S$ because it is below every element of $S$.
      It is not the infimum, because $0$ is a greater lower bound, and it is not the minimum, because $-5 \notin S$.
  - example: 0_for_s_eq_0_1
    why: >-
      $0$ is the infimum of $S$ because it is the greatest lower bound, so it is also a lower bound.
      It is not the minimum, because $0 \notin S$, and $S$ has no minimum.
  - example: 1_for_s_eq_1_2
    why: >-
      $1$ is the infimum of $[1, 2]$, and so a lower bound, and it belongs to the set, so it is the minimum.
      It is also a minimal element, because no element of the set is smaller.
  - example: set_1_in_the_collection_set_set_1_set_2_set_1_2
    why: >-
      $\lbrace 1 \rbrace$ is a minimal element because no set in the collection is strictly contained in it.
      It is not the minimum, because $\lbrace 1 \rbrace \not\subseteq \lbrace 2 \rbrace$.
  - example: x_eq_0_for_f_x_eq_x_squared_plus_3
    why: >-
      $x = 0$ is the minimizer of $f$ because $f$ takes its minimum value there.
      It is not the minimum, which is the value $f(0) = 3$.
  - example: 3_for_f_x_eq_x_squared_plus_3
    why: >-
      $3$ is the minimum value of $f$, and so its infimum, because $f(x) = x^2 + 3 \geq 3$, with equality at $x = 0$.
      It is not the minimizer, which is the point $0$ where the minimum occurs.
see_also:
  - types_of_extreme_values
  - types_of_limits
  - types_of_finite
---
## Notes

- "Smallest" and "least" are synonyms for minimum.
  "The smallest closed set containing $A$" (the closure) is a minimum with respect to $\subseteq$, not just a minimal set.
- To _minimize_ $f$ is to find its minimum value or its minimizers.
  "Minimize" is the verb; "minimum" and "minimizer" are nouns.
- Everything on this page has a mirror image: upper bound, supremum, maximum, maximal element, and maximizer.
