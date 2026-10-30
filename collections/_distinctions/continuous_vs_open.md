---
published: false
title: Continuous vs. open vs. closed maps
kind: siblings
areas: [topology]
status: draft
summary: >
  Continuity is about preimages: preimages of open sets are open. Open and closed maps are about images: images of open (or closed) sets are open (or closed).
  None of the three properties implies another.
terms:
  - continuous
  - open_map
  - closed_map
examples:
  - example: x_to_sin_x_from_reals_to_reals
    why: >-
      $\sin((-\pi, \pi)) = [-1, 1]$ is not open. The closed set $\lbrace 2 \pi n + 1/n : n \geq 2 \rbrace$ maps to $\lbrace \sin(1/n) \rbrace$, which is not closed because it does not contain its limit $0$.
  - example: x_y_to_x_from_reals_squared_to_reals
    why: >-
      The hyperbola $x y = 1$ is closed, but its image $\reals \setminus \lbrace 0 \rbrace$ is not.
  - example: x_to_x_squared_from_reals_to_reals
    why: >-
      The image of $(-1, 1)$ is $[0, 1)$, which is not open.
  - example: the_indicator_of_0_infinity_from_reals_to_set_0_1
    why: >-
      Every subset of a discrete space is open and closed, but the preimage of $\lbrace 1 \rbrace$ is $[0, \infty)$, which is not open.
  - example: x_to_x_cubed_from_reals_to_reals
    why: >-
      It is a homeomorphism.
see_also:
  - continuity_metric_vs_topological
  - types_of_continuous
---
## Notes

- A continuous bijection is a homeomorphism exactly when it is open (equivalently, closed).
- Every continuous map from a compact space to a Hausdorff space is closed.
