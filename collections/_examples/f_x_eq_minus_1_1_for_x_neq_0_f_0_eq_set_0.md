---
published: false
title: '$F(x) = [-1, 1]$ for $x \neq 0$, $F(0) = \setdef{0}$'
level: graduate
is: [set_valued_map, inner_semicontinuous, lower_semicontinuous_setvalued]
is_not: [outer_semicontinuous, upper_semicontinuous_setvalued]
why:
  lower_semicontinuous_setvalued: >-
    $F$ jumps down at $0$, so it is inner and lower semicontinuous: every point of $F(0)$ is a limit of points of $F(y)$.
  upper_semicontinuous_setvalued: >-
    $F$ jumps down at $0$, so it is not outer or upper semicontinuous, because $1 \in F(y)$ for $y \neq 0$ has no counterpart in $F(0)$.
---
