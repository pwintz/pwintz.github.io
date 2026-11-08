---
published: false
title: Interior vs. exterior vs. boundary
kind: siblings
areas: [topology, analysis, geometry]
summary: >
  Given a set in a space, every point of the space falls into exactly one of three parts.
  The interior of a set is the part well inside it, the [exterior](/definitions/exterior) is the part well outside it, and the boundary is where the two meet.
  Every point of the space is in exactly one of the three.
relation: >
  For any set $A$, the space is the disjoint union of $\operatorname{int} A$, $\partial A$, and $\operatorname{ext} A$.
terms:
  - interior
  - exterior
  - boundary
  - closure
examples:
  - example: solid_square
  - example: open_unit_interval
  - example: closed_unit_interval
    why: >-
      The closed interval $[0, 1]$ has the same interior, boundary, and exterior as the open interval $(0, 1)$: the two sets differ only in whether they contain their boundary points.
  - example: half_open_unit_interval
  - example: closed_unit_disk
  - example: rationals_as_a_subset_of_reals
  - example: disk_inside_circle
see_also:
  - boundary_vs_edge
  - types_of_sphere_balls_and_circles
---
## Notes

- "Inside" in everyday speech often means "enclosed by."
  A [circle](/definitions/circle) encloses a disk, but the circle's interior, as a set, is empty.
- The closure of a set is its interior together with its boundary.
