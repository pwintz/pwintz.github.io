---
published: false
title: '$\setdef{v \suchthat v_1 \leq 0}$, for the closed unit disk at $(1, 0)$'
level: graduate
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.6, 2.4]
    y: [-1.8, 1.8]
    shapes:
      - { halfplane: [[1, 0], [1, 0]], color: 1 }
      - { disk: [0, 0, 1] }
      - { point: [1, 0], label: "(1, 0)" }
  caption: |-
    The closed unit disk (blue), with the set $v_1 \leq 0$ drawn from the point $(1, 0)$ (orange).
  alt: "A shaded unit disk, and a shaded half-plane to the left of the vertical line through (1, 0)."
is: [
  contingent_cone,
  clarke_tangent_cone
]
is_not: [tangent_space]
why:
  tangent_space: >-
    $\setdef{v \suchthat v_1 \leq 0}$ is not a tangent space, because it is not a vector space: $(1, 0)$ points out of the disk.
  clarke_tangent_cone: >-
    $\setdef{v \suchthat v_1 \leq 0}$ is the Clarke tangent cone of the closed unit disk at $(1, 0)$, because the disk is convex, so its Clarke tangent cone is its contingent cone.
  contingent_cone: >-
    $\setdef{v \suchthat v_1 \leq 0}$ is the contingent cone of the closed unit disk at $(1, 0)$, because the directions $v$ in which points of the disk approach $(1, 0)$ are exactly those with $v_1 \leq 0$.
---
