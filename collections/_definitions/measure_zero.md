---
published: false
title: Measure zero
term: measure zero
applies_to: sets
synonyms: [null set, negligible set]
levels:
  undergraduate:
    context: subsets of $\reals$
    text: |-
      Consider a set $A \subseteq \reals$.
      The set $A$ has _measure zero_ if for every $\varepsilon > 0$, it can be covered by countably many intervals with total length less than $\varepsilon$.
  graduate:
    context: measure theory
    text: |-
      Consider a measure $\mu$ on a space (by default, Lebesgue measure) and a measurable set $A$.
      The set $A$ has _measure zero_ if $\mu(A) = 0$.
properties:
  - >-
    Every countable set of [real numbers](/definitions/real-number) has measure zero, and so do some [uncountable](/definitions/uncountable) sets, such as the Cantor set.
  - >-
    A countable [union](/definitions/set-union) of sets of measure zero has measure zero.
---
