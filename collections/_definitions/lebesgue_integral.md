---
published: false
title: Lebesgue integral
term: Lebesgue integral
applies_to: measurable functions
levels:
  undergraduate:
    context: measure theory
    text: |-
      Consider a [measurable function](/definitions/measurable-map) $f \geq 0$ on a measure space, such as $\reals$ with [Lebesgue measure](/definitions/lebesgue-measure) $\mu$.
      The _Lebesgue integral_ of $f$ slices the range of $f$ instead of its domain: it is the [supremum](/definitions/supremum) of the integrals of simple functions $s = \sum_k c_k \mathbf{1}_{A_k}$ below $f$,

      $$\int f \mathrm{d}\mu = \sup \setdef{\sum_k c_k \mu(A_k) \suchthat 0 \leq s \leq f}.$$

      A general $f$ is split as $f = f^{+} - f^{-}$ into its positive and negative parts, and $\int f \mathrm{d}\mu = \int f^{+} \mathrm{d}\mu - \int f^{-} \mathrm{d}\mu$ when both are finite.
properties:
  - >-
    Every Riemann integrable function on $[a, b]$ is Lebesgue integrable, with the same integral.
  - >-
    The Lebesgue integral works well with limits: the monotone and dominated convergence theorems let limits and integrals be exchanged under mild conditions.
---
