---
title: Full Measure
term: full measure
applies_to: sets
synonyms: [conull set, co-null set]
levels:
  undergraduate:
    context: subsets of $\reals$
    text: |-
      Consider a set $A \subseteq \reals$.
      The set $A$ has _full measure_ if the complement $\reals \setdiff A$ has [measure zero](/dictionary/definitions/measure-zero).
  graduate:
    context: measure theory
    text: |-
      Consider a measure $\mu$ on a space $X$ and a [measurable set](/dictionary/definitions/measurable-set) $A \subseteq X$.
      The set $A$ has _full measure_ if the complement of $A$ has [measure zero](/dictionary/definitions/measure-zero):

      $$\mu(X \setdiff A) = 0.$$
properties:
  - |-
    A set $A$ has full measure if and only if [almost every](/dictionary/definitions/almost-everywhere) point of $X$ is in $A$.
  - |-
    A [countable](/dictionary/definitions/countable) [intersection](/dictionary/definitions/set-intersection) of sets of full measure has full measure, because the complement of the intersection is a countable [union](/dictionary/definitions/set-union) of sets of [measure zero](/dictionary/definitions/measure-zero).
  - |-
    For Lebesgue measure on $\reals^n$, every set of full measure is [dense](/dictionary/definitions/dense-set), because every nonempty [open set](/dictionary/definitions/open-set) has positive measure and so is not contained in the complement.
  - |-
    For a [probability measure](/dictionary/definitions/probability-measure), an [event](/dictionary/definitions/event) has full measure if and only if its [probability](/dictionary/definitions/probability) is $1$.
---
"Full measure" is about the complement, not about the measure of $A$ itself.
If $\mu(X)$ is finite, then $A$ has full measure if and only if $\mu(A) = \mu(X)$.
If $\mu(X)$ is infinite, then $\mu(A) = \mu(X)$ is not enough: the interval $(0, \infty)$ has infinite Lebesgue measure, like $\reals$, but its complement $(-\infty, 0]$ also has infinite measure, so $(0, \infty)$ does not have full measure in $\reals$.
