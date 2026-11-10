---
published: false
title: '$F(x) = \setdef{0}$ for $x \neq 0$, $F(0) = [-1, 1]$'
level: graduate
is: [
  set_valued_map,
  outer_semicontinuous,
  upper_semicontinuous_setvalued
]
is_not: [
  inner_semicontinuous,
  lower_semicontinuous_setvalued
]
why:
  upper_semicontinuous_setvalued: >-
    $F$ jumps up at $0$, so it is outer and upper semicontinuous: limits of points of $F(y)$ lie in $F(0)$, and $F(y)$ stays near $F(0)$.
  lower_semicontinuous_setvalued: >-
    $F$ jumps up at $0$, so it is not inner or lower semicontinuous, because the point $1 \in F(0)$ is not a limit of points of $F(y)$ for $y \neq 0$.
---
