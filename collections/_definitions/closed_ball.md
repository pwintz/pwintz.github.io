---
published: false
title: Closed ball
term: closed ball
applies_to: sets of points
levels:
  high-school:
    text: |-
      A _closed ball_ is a [ball](/definitions/ball) together with its surface: all of the points at distance at most $r$ from a center $c$.
  undergraduate:
    context: metric spaces
    text: |-
      The _closed ball_ of radius $r$ around $c$ is $\overline{B}(c, r) = \lbrace x : d(x, c) \leq r \rbrace$, the points at distance at most $r$ from $c$.
properties:
  - >-
    The closed ball $\overline{B}(c, r)$ is the [union](/definitions/set-union) of the [open ball](/definitions/open-ball) $B(c, r)$ and the [sphere](/definitions/sphere) $S(c, r)$, and it is a closed set.
  - >-
    In $\reals^n$, the closed ball is the closure of the [open ball](/definitions/open-ball), but not in every [metric space](/definitions/metric-space). With the discrete [metric](/definitions/metric) ($d(x, y) = 1$ for $x \neq y$), the open ball of radius $1$ is $\lbrace c \rbrace$, which is already closed, but the closed ball of radius $1$ is the whole space.
---
