---
published: false
title: Types of tangent cones
kind: family
areas: [set-valued-analysis, geometry]
summary: >
  At a point of a set, the directions in which one can move while staying in the set (to first order) can be described in several ways.
  The [tangent space](/definitions/tangent-space) is defined for smooth surfaces.
  For sets with corners, there are several tangent cones:
  the [contingent cone](/definitions/contingent-cone) contains every direction that stays close to the set, and the Clarke cone keeps only the directions that work from every nearby point, which makes it convex.
relation: Clarke tangent cone ⊆ contingent cone, with equality for convex sets and smooth manifolds (where both equal the tangent space).
terms:
  - tangent_space
  - contingent_cone
  - clarke_tangent_cone
examples:
  - example: set_v_v_1_eq_0_for_the_unit_circle_at_1_0
  - example: set_v_v_1_leq_0_for_the_closed_unit_disk_at_1_0
  - example: set_v_v_2_geq_minus_v_1_for_s_eq_set_x_y_y_geq
  - example: set_v_v_2_geq_v_1_for_s_eq_set_x_y_y_geq_minus_x
see_also:
  - types_of_continuous_set-valued
  - types_of_dynamic_set_invariance
---
## Notes

- Tangent cones appear in Nagumo's theorem: a [closed set](/definitions/closed-set) $S$ is [forward invariant](/definitions/forward-invariant) for $\dot{x} = f(x)$ (with unique solutions) if and only if $f(x) \in T_S(x)$ for every $x \in S$, where $T_S$ is the [contingent cone](/definitions/contingent-cone).
- Terminology varies: "tangent cone" alone can mean either cone, depending on the author.
