---
published: false
title: 'Joining $(1, 2)$ and $(2, 3)$ end to end produces $(1, 2, 2, 3)$'
level: elementary
is: [concatenate]
is_not: [set_union]
why:
  set_union: >-
    Joining two lists end to end is not a union, which would remove the repeated $2$ and ignore order.
  concatenate: >-
    Joining $(1, 2)$ and $(2, 3)$ end to end is concatenation, which keeps the order and the repeated $2$.
---
