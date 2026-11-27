---
published: false
title: '$\setdef{v \suchthat v_1 = 0}$, for the unit circle at $(1, 0)$'
level: undergraduate
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.6, 2.4]
    y: [-1.8, 1.8]
    shapes:
      - { circle: [0, 0, 1] }
      - { line: [[1, 0], [0, 1]], color: 1, label: "v_1 = 0", label_at: [1, 1.4] }
      - { point: [1, 0], label: "(1, 0)" }
  caption: |-
    The unit circle (blue), with the set $v_1 = 0$ drawn through the point $(1, 0)$ (orange).
  alt: "A unit circle with a vertical line touching it at (1, 0)."
is: [
  tangent_space,
  contingent_cone,
  clarke_tangent_cone
]
why:
  tangent_space: >-
    $\setdef{v \suchthat v_1 = 0}$ is the tangent space of the unit circle at $(1, 0)$.
  clarke_tangent_cone: >-
    $\setdef{v \suchthat v_1 = 0}$ is the Clarke tangent cone of the unit circle at $(1, 0)$, because the circle is smooth there, so its Clarke tangent cone is its tangent space.
  contingent_cone: >-
    $\setdef{v \suchthat v_1 = 0}$ is the contingent cone of the unit circle at $(1, 0)$, because the circle is smooth there, so its contingent cone is its tangent space.
---
