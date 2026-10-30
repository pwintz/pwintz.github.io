---
published: false
title: Types of tangent cones
kind: family
areas: [set-valued-analysis, geometry]
status: draft
summary: >
  The tangent space is defined for smooth surfaces. For sets with corners, there are several tangent cones:
  the contingent cone contains every direction that stays close to the set, and the Clarke cone keeps only the directions that work from every nearby point, which makes it convex.
relation: Clarke tangent cone ⊆ contingent cone, with equality for convex sets and smooth manifolds (where both equal the tangent space).
terms:
  - tangent_space
  - contingent_cone
  - clarke_tangent_cone
examples:
  - example: set_v_v_1_eq_0_for_the_unit_circle_at_1_0
    why: >-
      The circle is smooth, so all three agree.
  - example: set_v_v_1_leq_0_for_the_closed_unit_disk_at_1_0
    why: >-
      The disk is convex, so both cones agree. It is not a vector space, since $(1, 0)$ points out of the disk.
  - example: set_v_v_2_geq_minus_v_1_for_s_eq_set_x_y_y_geq
    why: >-
      $S$ is a nonconvex cone, so its contingent cone at the origin is $S$ itself.
  - example: set_v_v_2_geq_v_1_for_s_eq_set_x_y_y_geq_minus_x
    why: >-
      Only these directions point into $S$ from every nearby boundary point.
see_also:
  - types_of_continuous_set-valued
  - types_of_dynamic_set_invariance
---
## Notes

- Tangent cones appear in Nagumo's theorem: a closed set $S$ is forward invariant for $\dot{x} = f(x)$ (with unique solutions) if and only if $f(x) \in T_S(x)$ for every $x \in S$, where $T_S$ is the contingent cone.
- Terminology varies: "tangent cone" alone can mean either cone, depending on the author.
