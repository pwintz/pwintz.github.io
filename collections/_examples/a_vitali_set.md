---
published: false
title: 'A Vitali set in $[0, 1]$'
level: graduate
detail: >-
  A Vitali set $V \subseteq [0, 1]$ contains exactly one number from each class of numbers in $[0, 1]$ that differ by a rational number.
  That is, for every $x \in [0, 1]$, there is exactly one $v \in V$ such that $x - v$ is rational.
  The axiom of choice is needed to choose $V$.
is_not: [
  measurable_set,
  borel_set
]
why:
  measurable_set: |-
    A Vitali set $V$ is not Lebesgue measurable.
    For each rational number $q \in [-1, 1]$, let $V + q$ be the set $V$ shifted by $q$.
    These countably many shifted sets are disjoint, and their union $U$ satisfies $[0, 1] \subseteq U \subseteq [-1, 2]$.
    If $V$ had a Lebesgue measure $m$, then each shifted set would also have measure $m$, and countable additivity would give

    $$1 \leq \sum_{q \in \mathbb{Q} \cap [-1, 1]} m \leq 3.$$

    The sum is $0$ if $m = 0$ and $\infty$ if $m > 0$, so no value of $m$ satisfies these inequalities.
  borel_set: >-
    A Vitali set is not a Borel set, because every Borel set of $\reals$ is Lebesgue measurable, but a Vitali set is not Lebesgue measurable.
---
