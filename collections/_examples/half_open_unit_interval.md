---
title: '$[0, 1)$, as a subset of $\reals$'
level: high-school
figure:
  widget: plane
  aspect: 4 / 1
  params:
    number_line: true
    x: [-0.5, 1.5]
    shapes:
      - { interval: [0, 1], ends: "[)" }
  caption: |-
    The interval $[0, 1)$.
  alt: "A number line with the segment from 0 to 1 highlighted, with a filled dot at 0 and a hollow dot at 1."
is: [borel_set]
is_not: [
  open_set,
  closed_set
]
values:
  interior: '$\operatorname{int} [0, 1) = (0, 1)$'
  boundary: '$\partial [0, 1) = \setdef{0, 1}$'
  exterior: '$\operatorname{ext} [0, 1) = (-\infty, 0) \cup (1, \infty)$'
  closure: '$\closureOf{[0, 1)} = [0, 1]$'
why:
  closure: >-
    The closure of $[0, 1)$ adds the missing boundary point $1$.
  open_set: >-
    The interval $[0, 1)$ is not open in $\reals$, because every interval around $0$ contains negative numbers.
  closed_set: >-
    The interval $[0, 1)$ is not closed in $\reals$, because it does not contain its boundary point $1$.
  borel_set: >-
    The interval $[0, 1)$ is a Borel set, because it is the intersection of the open set $(-1, 1)$ and the closed set $[0, \infty)$.
  boundary: >-
    The boundary contains $1$ even though the set does not, and $0$ even though the set does.
  interior: >-
    The interior of $[0, 1)$ is $(0, 1)$, because every point of $(0, 1)$ has a small interval around it within $[0, 1)$.
---
