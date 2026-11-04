---
published: false
title: Interior vs. exterior vs. boundary
kind: siblings
areas: [topology, analysis, geometry]
status: draft
summary: >
  The interior of a set is the part well inside it, the exterior is the part well outside it, and the boundary is where the two meet.
  Every point of the space is in exactly one of the three.
relation: >
  For any set $A$, the space is the disjoint union of $\operatorname{int} A$, $\partial A$, and $\operatorname{ext} A$.
terms:
  - interior
  - exterior
  - boundary
examples:
  - example: solid_square
    why: >-
      Every point inside the square has a small disk around it within the square, so the inside is the interior.
      Every small disk around a point on an edge reaches both inside and outside the square, so the edges are the boundary.
      The rest of the page is the exterior.
  - example: half_open_unit_interval
    why: >-
      The interior of $[0, 1)$ is $(0, 1)$, because every point of $(0, 1)$ has a small interval around it within $[0, 1)$.
      The boundary is $\lbrace 0, 1 \rbrace$, and $[0, 1)$ contains only one of its two boundary points.
  - example: closed_unit_disk
    why: >-
      The interior of $D$ is the open disk, because every point with $x^2 + y^2 < 1$ has a small disk around it within $D$.
      The boundary is the unit circle, which $D$ contains, and the exterior is everything outside the circle.
  - example: rationals_as_a_subset_of_reals
    why: >-
      Every interval contains rational and irrational numbers, so $\mathbb{Q}$ has an empty interior and an empty exterior.
      So every real number is a boundary point of $\mathbb{Q}$.
  - example: disk_inside_circle
    why: >-
      The open disk is not the interior of the circle: the interior of the circle is empty, because every small disk around a point of the circle contains points off the circle.
      The open disk is the region that the circle encloses.
see_also:
  - boundary_vs_edge
  - types_of_sphere_balls_and_circles
---
## Notes

- "Inside" in everyday speech often means "enclosed by."
  A circle encloses a disk, but the circle's interior, as a set, is empty.
- The closure of a set is its interior together with its boundary.
