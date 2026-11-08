---
published: false
title: '$F(x) = \setdef{1/x}$ for $x \neq 0$, $F(0) = \setdef{0}$'
level: graduate
is: [set_valued_map, outer_semicontinuous]
is_not: [upper_semicontinuous_setvalued, inner_semicontinuous, lower_semicontinuous_setvalued]
why:
  outer_semicontinuous: >-
    $F$ is outer semicontinuous because its graph (a hyperbola plus the origin) is closed.
  upper_semicontinuous_setvalued: >-
    $F(x) = \setdef{1/x}$ for $x \neq 0$, $F(0) = \setdef{0}$, is not upper semicontinuous, because $F(y)$ escapes every bounded open set $U \supseteq F(0)$ as $y \to 0$, and it is not inner or lower semicontinuous, because $0 \in F(0)$ is not a limit of points of $F(y)$.
---
