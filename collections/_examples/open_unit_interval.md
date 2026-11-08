---
title: '$(0, 1)$'
level: high-school
values:
  interior: '$\operatorname{int} (0, 1) = (0, 1)$'
  boundary: '$\partial (0, 1) = \setdef{0, 1}$'
  exterior: '$\operatorname{ext} (0, 1) = (-\infty, 0) \cup (1, \infty)$'
  closure: '$\overline{(0, 1)} = [0, 1]$'
is: [open_set, bounded]
is_not: [closed_set, finite_set, compact]
why:
  closure: >-
    The closure of $(0, 1)$ adds its boundary points $0$ and $1$.
  open_set: >-
    The interval $(0, 1)$ is open in $\reals$, because every point of $(0, 1)$ has a small interval around it inside $(0, 1)$.
  closed_set: >-
    The interval $(0, 1)$ is not closed in $\reals$, because the sequence $1/n$ in $(0, 1)$ converges to $0$, which is not in $(0, 1)$.
  interior: >-
    The interior of $(0, 1)$ is $(0, 1)$, because every point of $(0, 1)$ has a small interval around it inside $(0, 1)$; that is, $(0, 1)$ is open.
  boundary: >-
    The boundary of $(0, 1)$ is $\setdef{0, 1}$, because every interval around $0$ or $1$ contains points inside and outside $(0, 1)$.
  exterior: >-
    The exterior of $(0, 1)$ is everything outside $[0, 1]$, because each of those points has a small interval around it that misses $(0, 1)$.
  bounded: >-
    $(0, 1)$ is bounded.
  compact: >-
    $(0, 1)$ is not compact, because it is not closed: the sequence $1/n$ has no limit in $(0, 1)$, and it is not finite.
---
