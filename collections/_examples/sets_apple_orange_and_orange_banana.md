---
title: '$A = \setdef{\text{apple}, \text{orange}}$ and $B = \setdef{\text{orange}, \text{banana}}$'
level: high-school
values:
  set_union: '$A \cup B = \setdef{\text{apple}, \text{orange}, \text{banana}}$'
  set_intersection: '$A \cap B = \setdef{\text{orange}}$'
  union_of_disjoint_sets: 'None'
  disjoint_union: '$A \sqcup B = \setdef{(1, \text{apple}), (1, \text{orange}), (2, \text{orange}), (2, \text{banana})}$'
why:
  union_of_disjoint_sets: >-
    The union of $A = \setdef{\text{apple}, \text{orange}}$ and $B = \setdef{\text{orange}, \text{banana}}$ is not a union of disjoint sets, because $A$ and $B$ overlap.
  disjoint_union: >-
    The tagged disjoint union keeps both copies of orange, so it has $4$ elements.
---
