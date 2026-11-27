---
title: '$0$, for the set $S = (0, 1]$'
level: high-school
figure:
  widget: plane
  aspect: 3 / 1
  params:
    number_line: true
    x: [-0.5, 1.5]
    y: [-0.3, 0.75]
    shapes:
      - { interval: [0, 1], ends: "(]", label: "S" }
      - { interval: [-0.7, 0], ends: " ]", height: 0.3, color: 2, label: "lower bounds", words: true }
      - { point: [0, 0], open: true, color: 1, label: "0" }
  caption: |-
    The set $S = (0, 1]$ (blue), the number $0$ (orange), and the lower bounds of $S$, the numbers $x \leq 0$ (green, continuing to the left).
  alt: "A number line with the segment from 0 to 1 highlighted, hollow at 0 and filled at 1, with the hollow dot at 0 in orange, and above the line a green ray of the lower bounds, from 0 to the left."
is: [
  lower_bound,
  infimum
]
is_not: [minimum]
why:
  lower_bound: >-
    $0$ is a lower bound of $S = (0, 1]$, because $0 \leq x$ for every $x \in S$.
    It is not the only one: every number less than $0$ is also a lower bound of $S$.
  minimum: >-
    $0$ is not the minimum, because $0 \notin S$, and $S$ has no minimum.
  infimum: >-
    $0$ is the infimum of $S$ because it is the greatest lower bound, so it is also a lower bound.
---
