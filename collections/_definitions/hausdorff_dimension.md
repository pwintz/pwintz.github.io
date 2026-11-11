---
title: Hausdorff dimension
term: Hausdorff dimension
applies_to: subsets of $\reals^n$ and metric spaces
synonyms: [fractal dimension]
levels:
  high-school:
    text: |-
      Consider a shape, such as a segment, a square, or a cube.
      Scaling the shape up by a factor of $2$ multiplies its "size" by $2^d$, where $d$ is its dimension: by $2$ for a segment, $4$ for a square, and $8$ for a cube.
      The _Hausdorff dimension_ makes this precise. 
      
  graduate:
    context: metric spaces
    text: |-
      Consider a [subset](/dictionary/definitions/subset) $A$ of a [metric space](/dictionary/definitions/metric-space) and a number $s \geq 0$.
      The $s$-dimensional _Hausdorff measure_ of $A$ adds up the [diameters](/dictionary/definitions/diameter) of small sets that cover $A$, each raised to the power $s$:

      $$\mathcal{H}^s(A) = \lim_{\delta \to 0} \inf \setdef{\sum_{i = 1}^{\infty} \operatorname{diam}(U_i)^s \suchthat A \subseteq \bigcup_{i = 1}^{\infty} U_i, \ \operatorname{diam}(U_i) < \delta}.$$

      The _Hausdorff dimension_ of $A$ is the number at which $\mathcal{H}^s(A)$ jumps from $\infty$ to $0$:

      $$\dim_H(A) = \inf \setdef{s \geq 0 \suchthat \mathcal{H}^s(A) = 0}.$$
properties:
  - >-
    For a smooth curve, surface, or solid, the Hausdorff dimension is $1$, $2$, or $3$, its usual dimension.
  - >-
    Every [countable](/dictionary/definitions/countable) set has Hausdorff dimension $0$.
  - >-
    The Cantor set has Hausdorff dimension $\log 2 / \log 3 \approx 0.63$, because it consists of $2$ copies of itself, each scaled down by a factor of $3$.
---
The Hausdorff dimension of a set is a different notion from the [dimension of a vector space](/dictionary/definitions/dimension-vector-space), which counts the vectors in a [basis](/dictionary/definitions/vector-basis).

For some shapes, called fractals, the Hausdorff dimension is not a whole number.