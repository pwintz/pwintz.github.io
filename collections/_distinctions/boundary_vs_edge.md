---
published: false
title: Boundary vs. edge
kind: siblings
areas: [geometry, topology]
status: draft
summary: >
  The boundary of a set is everything that touches both the set and its outside.
  An edge is a segment of a polygon or polyhedron, or a connection in a graph.
# The boundary of a solid cube is its six faces, not its twelve edges.
terms:
  - boundary
  - edge_polygon
  - edge_graph
examples:
  - example: the_unit_circle_for_the_closed_unit_disk_in_reals
    why: >-
      The unit circle is the boundary of the closed unit disk because every ball around a point of the circle contains points inside and outside the disk.
      It is not an edge of a polygon, since the disk has no straight sides, and it is not an edge of a graph, since it is not a link between two vertices.
  - example: one_side_of_a_square
    why: >-
      One side of a square is an edge of the square, viewed as a polygon.
      It is not the boundary of the square, because the boundary consists of all four sides.
  - example: the_surface_six_faces_of_a_solid_cube
    why: >-
      The six faces form the boundary of the solid cube because every ball around a point of a face contains points inside and outside the cube.
      They are not edges of the cube, which are the twelve segments where the faces meet.
  - example: the_connection_between_two_people_in_a_social
    why: >-
      The connection is an edge of a graph whose vertices are people.
      It is not an edge of a polygon or a boundary, because a graph edge is a pair of vertices, with no geometry.
  - example: reals_for_rationals_subseteq_reals
    why: >-
      $\reals$ is the boundary of $\mathbb{Q}$ because every interval contains rational and irrational numbers, so every real number is a boundary point of $\mathbb{Q}$.
see_also:
  - interior_vs_exterior_vs_boundary
  - types_of_sphere_balls_and_circles
  - types_of_illustrations
---
<!-- ## The boundary of a manifold is different

A closed disk in $\reals^3$ (such as a coin lying flat) has a topological boundary in $\reals^3$ equal to the whole disk, since every ball around a point of the disk contains points off the disk.
But as a manifold with boundary, the disk's boundary is its rim, a circle.
The two notions agree for a closed disk in $\reals^2$, which is why they are easy to confuse. -->

## Notes

- The boundary of every set is closed.
<!-- - The boundary of $A$ is not $/\operatorname{int}(A) \cap \operatorname{ext}(A)$; the interior and exterior are always disjoint. -->
