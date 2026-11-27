---
title: '$1$, for $S = [1, 2]$'
level: high-school
figure:
  widget: plane
  aspect: 4 / 1
  params:
    number_line: true
    x: [0.5, 2.5]
    shapes:
      - { interval: [1, 2], ends: "[]", label: "S" }
      - { point: [1, 0], color: 1, label: "1" }
  caption: |-
    The set $S = [1, 2]$ (blue) and the number $1$ (orange).
  alt: "A number line with the segment from 1 to 2 highlighted, with the filled dot at 1 in orange."
is: [
  lower_bound,
  infimum,
  minimum,
  minimal_element
]
why:
  minimal_element: >-
    $1$ is a minimal element of $[1, 2]$, because no element of $[1, 2]$ is smaller than $1$.
  lower_bound: >-
    $1$ is a lower bound of $[1, 2]$, because every element of $[1, 2]$ is at least $1$.
  infimum: >-
    $1$ is the infimum of $[1, 2]$, because $1$ is a lower bound of $[1, 2]$, and no number larger than $1$ is a lower bound, since $1$ itself is in $[1, 2]$.
  minimum: >-
    $1$ is the minimum of $[1, 2]$, because $1$ is in $[1, 2]$ and is a lower bound of $[1, 2]$.
---
