---
published: false
title: Supremum
term: supremum
applies_to: ordered sets
synonyms: [least upper bound, $\sup$]
levels:
  high-school:
    context: sets of real numbers
    text: |-
      Consider a set $S$ of real numbers.
      The _supremum_ of $S$ is the smallest number that is greater than or equal to every element of $S$.
  undergraduate:
    context: partially ordered sets
    text: |-
      Consider a partially ordered set and a subset $S$ of it, with its upper bounds: the elements $M$ with $x \leq M$ for every $x \in S$.
      The _supremum_ of $S$ is an upper bound $M$ of $S$ such that $M \leq M^{\prime}$ for every upper bound $M^{\prime}$ of $S$.
properties:
  - |-
    Every nonempty set of [real numbers](/definitions/real-number) that is [bounded](/definitions/bounded) above has a supremum.
    This is the completeness of $\reals$.
  - |-
    If the supremum of $S$ belongs to $S$, it is the [maximum](/definitions/maximum) of $S$.
  - |-
    The supremum of $S$ is the negative of the [infimum](/definitions/infimum) of $\lbrace -x : x \in S \rbrace$.
---
