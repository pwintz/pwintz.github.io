---
published: false
title: Types of tangent cones
kind: family
areas: [set-valued-analysis, geometry]
status: draft
summary: >
  The tangent space is defined for smooth surfaces.
  For sets with corners, there are several tangent cones:
  the contingent cone contains every direction that stays close to the set, and the Clarke cone keeps only the directions that work from every nearby point, which makes it convex.
relation: Clarke tangent cone ⊆ contingent cone, with equality for convex sets and smooth manifolds (where both equal the tangent space).
terms:
  - tangent_space
  - contingent_cone
  - clarke_tangent_cone
examples:
  - example: set_v_v_1_eq_0_for_the_unit_circle_at_1_0
    why: >-
      $\setdef{v \suchthat v_1 = 0}$ is the tangent space of the unit circle at $(1, 0)$.
      The circle is smooth there, so the contingent cone and the Clarke tangent cone agree with the tangent space.
  - example: set_v_v_1_leq_0_for_the_closed_unit_disk_at_1_0
    why: >-
      $\setdef{v \suchthat v_1 \leq 0}$ is the contingent cone and the Clarke tangent cone of the disk at $(1, 0)$, which agree because the disk is convex.
      It is not a tangent space, because it is not a vector space: $(1, 0)$ points out of the disk.
  - example: set_v_v_2_geq_minus_v_1_for_s_eq_set_x_y_y_geq
    why: >-
      $\setdef{v \suchthat v_2 \geq -\lvert v_1 \rvert}$ is the contingent cone of $S$ at the origin, because $S$ is a cone, so its contingent cone there is $S$ itself.
      It is not the Clarke tangent cone, because $S$ is not convex, and it is not a tangent space.
  - example: set_v_v_2_geq_v_1_for_s_eq_set_x_y_y_geq_minus_x
    why: >-
      $\setdef{v \suchthat v_2 \geq \lvert v_1 \rvert}$ is the Clarke tangent cone of $S$ at the origin, because only these directions point into $S$ from every nearby boundary point.
      It is not the contingent cone, which is larger, and it is not a tangent space.
see_also:
  - types_of_continuous_set-valued
  - types_of_dynamic_set_invariance
---
## Notes

- Tangent cones appear in Nagumo's theorem: a closed set $S$ is forward invariant for $\dot{x} = f(x)$ (with unique solutions) if and only if $f(x) \in T_S(x)$ for every $x \in S$, where $T_S$ is the contingent cone.
- Terminology varies: "tangent cone" alone can mean either cone, depending on the author.
