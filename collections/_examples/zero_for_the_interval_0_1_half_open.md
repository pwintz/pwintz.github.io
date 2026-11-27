---
published: false
title: 'The point $0$, for the set $(0, 1]$'
level: high-school
figure:
  widget: plane
  aspect: 4 / 1
  params:
    number_line: true
    x: [-0.5, 1.5]
    shapes:
      - { interval: [0, 1], ends: "(]", label: "(0, 1]" }
      - { point: [0, 0], open: true, color: 1, label: "0" }
  caption: |-
    The set $(0, 1]$ (blue) and the point $0$ (orange).
  alt: "A number line with the segment from 0 to 1 highlighted, hollow at 0 and filled at 1, with the hollow dot at 0 in orange."
is: [
  limit_point,
  adherent_point
]
is_not: [isolated_point]
why:
  limit_point: >-
    The point $0$ is a limit point of $(0, 1]$, because for every $\varepsilon > 0$, the interval $(-\varepsilon, \varepsilon)$ contains points of $(0, 1]$ other than $0$, such as $\min(\varepsilon / 2, 1)$.
  adherent_point: >-
    The point $0$ is an adherent point of $(0, 1]$, because points of $(0, 1]$ come arbitrarily close to $0$.
  isolated_point: >-
    The point $0$ is not an isolated point of $(0, 1]$, because $0$ does not belong to $(0, 1]$.
---
