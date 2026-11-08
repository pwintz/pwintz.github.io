---
published: false
title: Closed ball
term: closed ball
applies_to: sets of points
levels:
  high-school:
    text: |-
      Consider a center $c$ and a radius $r$.
      The _closed ball_ with center $c$ and radius $r$ is a [ball](/definitions/ball) together with its surface: all of the points at distance at most $r$ from $c$.
  undergraduate:
    context: metric spaces
    text: |-
      Consider a [metric space](/definitions/metric-space) with [metric](/definitions/metric) $d$, a center $c$, and a radius $r$.
      The _closed ball_ of radius $r$ around $c$ is the set of points at distance at most $r$ from $c$:

      $$\overline{B}(c, r) = \setdef{x \suchthat d(x, c) \leq r}.$$
properties:
  - >-
    The closed ball $\overline{B}(c, r)$ is the [union](/definitions/set-union) of the [open ball](/definitions/open-ball) $B(c, r)$ and the [sphere](/definitions/sphere) $S(c, r)$, and it is a [closed set](/definitions/closed-set).
  - >-
    In $\reals^n$, the closed ball is the closure of the [open ball](/definitions/open-ball), but not in every [metric space](/definitions/metric-space).
    With the discrete [metric](/definitions/metric) ($d(x, y) = 1$ for $x \neq y$), the open ball of radius $1$ is $\setdef{c}$, which is already closed, but the closed ball of radius $1$ is the whole space.
---
