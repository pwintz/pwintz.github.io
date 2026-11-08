---
published: false
title: Infimum
term: infimum
applies_to: ordered sets
synonyms: [greatest lower bound, $\inf$]
levels:
  high-school:
    context: sets of real numbers
    text: |-
      Consider a set $S$ of [real numbers](/definitions/real-number).
      The _infimum_ of $S$ is the largest number that is less than or equal to every element of $S$.
  undergraduate:
    context: partially ordered sets
    text: |-
      Consider a partially ordered set and a [subset](/definitions/subset) $S$ of it.
      The _infimum_ of $S$ is a [lower bound](/definitions/lower-bound) $m$ of $S$ such that

      $$m^{\prime} \leq m \quad \text{for every lower bound } m^{\prime} \text{ of } S.$$
properties:
  - >-
    Every nonempty set of [real numbers](/definitions/real-number) that is [bounded](/definitions/bounded) below has an infimum.
    This is the completeness of $\reals$, and it fails in $\mathbb{Q}$.
  - >-
    If the infimum of $S$ belongs to $S$, it is the minimum of $S$.
---
