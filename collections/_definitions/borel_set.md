---
title: Borel Set
term: Borel set
applies_to: subsets of a topological space
synonyms: [Borel-measurable set]
levels:
# TODO: Write a less confusing definition.
#   undergraduate:
#     context: subsets of $\reals$
#     text: |-
#       Consider a set $B$ of [real numbers](/dictionary/definitions/real-number).
#       The set $B$ is a _Borel set_ if $B$ belongs to every collection $\mathcal{C}$ of [subsets](/dictionary/definitions/subset) of $\reals$ such that
# 
#       1. $\mathcal{C}$ contains every open interval,
#       2. $\mathcal{C}$ contains the complement of each set in $\mathcal{C}$, and
#       3. $\mathcal{C}$ contains the [union](/dictionary/definitions/set-union) of every sequence of sets in $\mathcal{C}$.
  graduate:
    context: topological spaces
    text: |-
      Consider a set $X$ with a [topology](/dictionary/definitions/topology) $\mathcal{T}$.
      A set $B \subseteq X$ is a _Borel set_ if $B$ is in the [Borel σ-algebra](/dictionary/definitions/borel-sigma-algebra) of $X$, which is the smallest [σ-algebra](/dictionary/definitions/sigma-algebra) on $X$ that contains every [open set](/dictionary/definitions/open-set).
properties:
  - >-
    Every [open set](/dictionary/definitions/open-set) and every [closed set](/dictionary/definitions/closed-set) is a Borel set.
  - >-
    Every [countable](/dictionary/definitions/countable) [subset](/dictionary/definitions/subset) of $\reals$ is a Borel set, because it is a countable [union](/dictionary/definitions/set-union) of one-point sets, which are closed.
  - >-
    Every Borel set of $\reals^n$ is Lebesgue measurable.
  - >-
    Some Lebesgue-measurable sets are not Borel sets: every subset of the Cantor set is Lebesgue measurable, because the Cantor set has [measure zero](/dictionary/definitions/measure-zero), but some [subsets](/dictionary/definitions/subset) of the Cantor set are not Borel sets.
  - >-
    The collection of Borel sets of $\reals$ has the same [cardinality](/dictionary/definitions/cardinality) $\mathfrak{c}$ as $\reals$, but $\reals$ has $2^{\mathfrak{c}}$ [subsets](/dictionary/definitions/subset), so most subsets of $\reals$ are not Borel sets.
  - >-
    The [preimage](/dictionary/definitions/preimage) of every Borel set under a [continuous](/dictionary/definitions/continuous) function is a Borel set, so every continuous function is Borel measurable.
---
Borel sets are named after Émile Borel.
