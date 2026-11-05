---
published: false
title: Continuous vs. open vs. closed maps
kind: siblings
areas: [topology]
status: draft
summary: >
  Continuity is about preimages: preimages of open sets are open.
  Open and closed maps are about images: images of open (or closed) sets are open (or closed).
  None of the three properties implies another.
terms:
  - continuous
  - open_map
  - closed_map
examples:
  - example: x_to_sin_x_from_reals_to_reals
    why: >-
      $\sin$ is continuous.
      It is not an open map, because $\sin((-\pi, \pi)) = [-1, 1]$ is not open.
      It is not a closed map, because the closed set $\setdef{2 \pi n + 1/n \suchthat n \geq 2}$ maps to $\setdef{\sin(1/n) \suchthat n \geq 2}$, which does not contain its limit $0$.
  - example: x_y_to_x_from_reals_squared_to_reals
    why: >-
      The projection $(x, y) \mapsto x$ is continuous, and it is an open map because it maps every open disk to an open interval.
      It is not a closed map, because the hyperbola $x y = 1$ is closed, but its image $\reals \setminus \lbrace 0 \rbrace$ is not.
  - example: x_to_x_squared_from_reals_to_reals
    why: >-
      $x \mapsto x^2$ is continuous, and it is a closed map.
      It is not an open map, because the image of $(-1, 1)$ is $[0, 1)$, which is not open.
  - example: the_indicator_of_0_infinity_from_reals_to_set_0_1
    why: >-
      The indicator is an open map and a closed map because every subset of a discrete space is open and closed.
      It is not continuous, because the preimage of the open set $\lbrace 1 \rbrace$ is $[0, \infty)$, which is not open.
  - example: x_to_x_cubed_from_reals_to_reals
    why: >-
      $x \mapsto x^3$ is a homeomorphism of $\reals$: it is continuous, with the continuous inverse $x \mapsto \sqrt[3]{x}$.
      So it maps open sets to open sets and closed sets to closed sets.
see_also:
  - continuity_metric_vs_topological
  - types_of_continuous
---
## Notes

- A continuous bijection is a homeomorphism exactly when it is open (equivalently, closed).
- Every continuous map from a compact space to a Hausdorff space is closed.
