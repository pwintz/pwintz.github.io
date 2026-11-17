---
published: false
title: '$f(x, y) = x^2 + y^2 - 1$ on $\reals^2$'
level: high-school
description: >-
  The function $f : \reals^2 \to \reals$ given by $f(x, y) = x^2 + y^2 - 1$, whose value is the squared distance from the origin minus $1$.
values:
  preimage: '$f^{-1}([-1, 0]) = \setdef{(x, y) \suchthat x^2 + y^2 \leq 1}$'
  level_set: 'Zero level set: the unit circle $\setdef{(x, y) \suchthat x^2 + y^2 = 1}$'
  sublevel_set: 'Zero sublevel set: the closed unit disk $\setdef{(x, y) \suchthat x^2 + y^2 \leq 1}$'
why:
  preimage: >-
    For $f(x, y) = x^2 + y^2 - 1$, the value $f(x, y)$ is in $[-1, 0]$ exactly when $0 \leq x^2 + y^2 \leq 1$, so the preimage of $[-1, 0]$ is the closed unit disk.
    This preimage equals the zero sublevel set of $f$, because $f(x, y) \geq -1$ for every $(x, y)$.
  level_set: >-
    The zero level set of $f(x, y) = x^2 + y^2 - 1$ is the set where $x^2 + y^2 - 1 = 0$, which is the set of points at distance $1$ from the origin: the unit circle.
  sublevel_set: >-
    The zero sublevel set of $f(x, y) = x^2 + y^2 - 1$ is the set where $x^2 + y^2 - 1 \leq 0$, which is the set of points at distance at most $1$ from the origin: the closed unit disk.
    Its boundary is the unit circle, the zero level set of $f$.
---
