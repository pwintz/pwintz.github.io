---
published: false
title: T₁ vs. Hausdorff vs. normal vs. metrizable spaces
kind: hierarchy
areas: [topology]
status: draft
summary: >
  The separation axioms say how well open sets can tell points and closed sets apart.
  Each is stronger than the one before, and every metrizable space satisfies all of them.
relation: metrizable ⊂ normal ⊂ Hausdorff ⊂ T₁
terms:
  - T1_space
  - hausdorff_space
  - normal_space
  - metrizable
examples:
  - example: reals_with_the_usual_topology
    why: >-
      $\reals$ with the usual topology is metrizable, with the metric $\lvert x - y \rvert$.
      Every metric space is normal and Hausdorff, so it is also normal, Hausdorff, and T₁.
  - example: the_sorgenfrey_line_the_reals_with_half_open
    why: >-
      The Sorgenfrey line is normal, and so Hausdorff and T₁.
      It is not metrizable, because it is separable but not second countable, which is impossible for a metric space.
  - example: the_line_with_two_origins
    why: >-
      The line with two origins is T₁, because each point is closed.
      It is not Hausdorff, and so not normal or metrizable, because the two origins cannot be separated by disjoint open sets; this is why manifolds are required to be Hausdorff.
  - example: an_infinite_set_with_the_cofinite_topology
    why: >-
      An infinite set with the cofinite topology is T₁, because each point is closed.
      It is not Hausdorff, and so not normal or metrizable, because any two nonempty open sets intersect.
  - example: the_sierpi_ski_space_set_0_1_with_open_sets_empty
    why: >-
      The Sierpiński space is not T₁, because the point $1$ is not closed.
      So it is not Hausdorff, normal, or metrizable.
see_also:
  - types_of_compactness
---
## Notes

- Between Hausdorff and normal are the _regular_ spaces (T₃), in which a point and a closed set not containing it have disjoint neighborhoods.
- The Urysohn metrization theorem says that a second-countable regular Hausdorff space is metrizable.
