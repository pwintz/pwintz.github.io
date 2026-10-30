---
published: false
title: T₁ vs. Hausdorff vs. normal vs. metrizable spaces
kind: hierarchy
areas: [topology]
status: draft
summary: >
  The separation axioms say how well open sets can tell points and closed sets apart. Each is stronger than the one before,
  and every metrizable space satisfies all of them.
relation: metrizable ⊂ normal ⊂ Hausdorff ⊂ T₁
terms:
  - T1_space
  - hausdorff_space
  - normal_space
  - metrizable
examples:
  - example: reals_with_the_usual_topology
    why: >-
      Every metric space is normal.
  - example: the_sorgenfrey_line_the_reals_with_half_open
    why: >-
      It is normal but not second countable, while being separable, which is impossible for a metric space.
  - example: the_line_with_two_origins
    why: >-
      The two origins cannot be separated by disjoint open sets. This is why manifolds are required to be Hausdorff.
  - example: an_infinite_set_with_the_cofinite_topology
    why: >-
      Any two nonempty open sets intersect.
  - example: the_sierpi_ski_space_set_0_1_with_open_sets_empty
    why: >-
      The point $1$ is not closed.
see_also:
  - types_of_compactness
---
## Notes

- Between Hausdorff and normal are the _regular_ spaces (T₃), in which a point and a closed set not containing it have disjoint neighborhoods.
- The Urysohn metrization theorem says that a second-countable regular Hausdorff space is metrizable.
