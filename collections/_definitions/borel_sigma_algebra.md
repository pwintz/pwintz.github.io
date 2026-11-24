---
title: Borel σ-Algebra
term: Borel σ-algebra
applies_to: topological spaces
synonyms: [Borel sigma-algebra, Borel σ-field]
levels:
  undergraduate:
    context: subsets of $\reals$
    text: |-
      The _Borel σ-algebra_ of $\reals$ is the smallest [σ-algebra](/dictionary/definitions/sigma-algebra) on $\reals$ that contains every open interval.
  graduate:
    context: topological spaces
    text: |-
      Consider a set $X$ with a [topology](/dictionary/definitions/topology) $\mathcal{T}$.
      The _Borel σ-algebra_ $\mathcal{B}(X)$ of $X$ is the smallest [σ-algebra](/dictionary/definitions/sigma-algebra) on $X$ that contains every [open set](/dictionary/definitions/open-set):

      $$\mathcal{B}(X) = \bigcap \setdef{\mathcal{F} \suchthat \mathcal{F} \text{ is a } \sigma\text{-algebra on } X \text{ and } \mathcal{T} \subseteq \mathcal{F}}.$$
properties:
  - |-
    The [intersection](/dictionary/definitions/set-intersection) in the definition is itself a [σ-algebra](/dictionary/definitions/sigma-algebra) that contains every [open set](/dictionary/definitions/open-set), so the smallest such σ-algebra exists.
  - |-
    The Borel σ-algebra of $\reals^n$ is also the smallest [σ-algebra](/dictionary/definitions/sigma-algebra) that contains every open box, because every [open set](/dictionary/definitions/open-set) of $\reals^n$ is a [countable](/dictionary/definitions/countable) [union](/dictionary/definitions/set-union) of open boxes.
  - |-
    The Borel σ-algebra of $\reals$ is also the smallest [σ-algebra](/dictionary/definitions/sigma-algebra) that contains every interval of the form $(a, \infty)$.
  - |-
    The Borel σ-algebra of $\reals$ has the same [cardinality](/dictionary/definitions/cardinality) $\mathfrak{c}$ as $\reals$.
  - |-
    The Lebesgue [σ-algebra](/dictionary/definitions/sigma-algebra) on $\reals^n$ contains the Borel σ-algebra, and the Lebesgue σ-algebra is larger: the Lebesgue σ-algebra also contains every [subset](/dictionary/definitions/subset) of a [Borel set](/dictionary/definitions/borel-set) of [measure zero](/dictionary/definitions/measure-zero).
---
The sets in the Borel σ-algebra are called [Borel sets](/dictionary/definitions/borel-set).
The Borel σ-algebra is named after Émile Borel.
