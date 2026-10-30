---
published: false
title: Size, length, area, volume, diameter, cardinality, dimension, and measure
kind: family
areas: [geometry, analysis]
status: draft
summary: >
  "Size" is informal. Each technical term measures a different aspect of a set, and the same set can be large in one sense and small in another.
terms:
  - arc_length
  - area
  - volume
  - diameter
  - cardinality
  - norm
  - dimension_vector_space
  - lebesgue_measure
see_also:
  - types_of_infinity
  - norm_vs_metric_vs_inner_product
  - types_of_sparsity
  - units_vs_dimension
---
## The same set, measured different ways

| Set | Cardinality | Length or area (measure) | Diameter | Dimension (topological or Hausdorff) |
| --- | --- | --- | --- | --- |
| $\lbrace 0, 1 \rbrace$ | $2$ | $0$ | $1$ | $0$ |
| $[0, 1]$ | uncountable | length $1$ | $1$ | $1$ |
| $[0, 1] \cap \mathbb{Q}$ | countably infinite | $0$ | $1$ | $0$ |
| The Cantor set | uncountable | $0$ | $1$ | $\log 2 / \log 3$ (Hausdorff) |
| The unit circle | uncountable | arc length $2\pi$, area $0$ | $2$ | $1$ |
| The closed unit disk | uncountable | area $\pi$ | $2$ | $2$ |
| $\reals$ | uncountable | infinite | infinite | $1$ |

## Notes

- The Cantor set shows that being uncountable and having measure zero are compatible.
- "Area" of a circle usually means the area of the disk inside it.
- The norm of a vector is its length, which is different from the arc length of a curve and the measure of a set.
- "Amount" and "quantity" are not technical terms.
