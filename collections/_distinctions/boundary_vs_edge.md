---
published: false
title: Boundary vs. edge
kind: siblings
areas: [geometry, topology]
status: draft
summary: >
  The boundary of a set is everything that touches both the set and its outside. An edge is a segment of a polygon or polyhedron,
  or a connection in a graph. The boundary of a solid cube is its six faces, not its twelve edges.
terms:
  - boundary
  - edge_polygon
  - edge_graph
examples:
  - example: the_unit_circle_for_the_closed_unit_disk_in_reals
    why: >-
      Every ball around a point on the circle contains points inside and outside the disk.
  - example: one_side_of_a_square
    why: >-
      It is part of the square's boundary, but the boundary consists of all four sides.
  - example: the_surface_six_faces_of_a_solid_cube
    why: >-
      The boundary of a three-dimensional solid is two-dimensional.
  - example: the_connection_between_two_people_in_a_social
    why: >-
      A graph edge is a pair of vertices, with no geometry.
  - example: reals_for_rationals_subseteq_reals
    why: >-
      Every interval contains rational and irrational numbers, so every real number is a boundary point of $\mathbb{Q}$.
see_also:
  - types_of_sphere_balls_and_circles
  - types_of_illustrations
---
## The boundary of a manifold is different

A closed disk in $\reals^3$ (such as a coin lying flat) has a topological boundary in $\reals^3$ equal to the whole disk, since every ball around a point of the disk contains points off the disk.
But as a manifold with boundary, the disk's boundary is its rim, a circle.
The two notions agree for a closed disk in $\reals^2$, which is why they are easy to confuse.

## Notes

- The boundary of a set is always closed.
- The boundary of $A$ is not $\operatorname{int}(A) \cap \operatorname{ext}(A)$; the interior and exterior are always disjoint.
