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
    $F$ is not upper semicontinuous at $0$, because $F(y)$ escapes every bounded open set $U \supseteq F(0)$ as $y \to 0$.
  inner_semicontinuous: >-
    $F$ is not inner semicontinuous at $0$, because $0 \in F(0)$ is not a limit of points of $F(y)$.
  lower_semicontinuous_setvalued: >-
    $F$ is not lower semicontinuous at $0$, because $0 \in F(0)$ is not a limit of points of $F(y)$.
---
