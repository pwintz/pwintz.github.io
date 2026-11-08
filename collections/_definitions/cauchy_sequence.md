---
published: false
title: Cauchy sequence
term: Cauchy sequence
applies_to: sequences
levels:
  undergraduate:
    context: metric spaces
    text: |-
      Consider a [sequence](/definitions/sequence) $(a_n)$ in a [metric space](/definitions/metric-space).
      The sequence is _Cauchy_ if its terms get arbitrarily close to each other: for every $\varepsilon > 0$, there is $N$ such that

      $$d(a_m, a_n) < \varepsilon \quad \text{for all } m, n \geq N.$$
properties:
  - >-
    Every [convergent](/definitions/convergent) sequence is Cauchy, but a Cauchy sequence need not converge: in $\mathbb{Q}$, the decimal approximations $1, 1.4, 1.41, \dots$ of $\sqrt{2}$ are Cauchy but have no limit in $\mathbb{Q}$.
  - >-
    Unlike convergence, the Cauchy condition does not mention the limit, so it can be checked without knowing the limit in advance.
---
