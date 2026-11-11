---
published: false
title: Types of semicontinuity of set-valued maps
kind: family
areas: [set-valued-analysis]
summary: >
  A [set-valued map](/dictionary/definitions/set-valued-map) assigns a set to each point, and there is more than one way to say that the set changes continuously.
  Outer and upper semicontinuity both say that $F(x)$ cannot suddenly shrink in the limit, but they are not the same: outer semicontinuity is a closed-graph condition, while upper semicontinuity also rules out values escaping to infinity.
  Inner and lower semicontinuity say that $F(x)$ cannot suddenly grow, and they agree in [metric spaces](/dictionary/definitions/metric-space).
terms:
  - set_valued_map
  - outer_semicontinuous
  - upper_semicontinuous_setvalued
  - inner_semicontinuous
  - lower_semicontinuous_setvalued
examples_note: >-
  Each row is a set-valued map $F : \reals \rightrightarrows \reals$.
  Is it ___ at $x = 0$?
examples:
  - example: f_x_eq_set_0_for_x_neq_0_f_0_eq_minus_1_1
  - example: f_x_eq_minus_1_1_for_x_neq_0_f_0_eq_set_0
  - example: f_x_eq_set_1_x_for_x_neq_0_f_0_eq_set_0
  - example: f_x_eq_set_f_x_for_a_continuous_function_f
see_also:
  - types_of_tangent_spaces
  - types_of_continuous
---
## Notes

- If $F$ has closed values and is locally [bounded](/dictionary/definitions/bounded) (in finite dimensions), then outer and upper semicontinuity are equivalent.
  Much of the literature assumes this setting, which is why the terms are often treated as synonyms.
- "Hemicontinuous" is used in economics (for example, by Aliprantis and Border) for Berge's notions, to avoid confusion with semicontinuity of real-valued functions.
- A real-valued function $f$ is [lower semicontinuous](/dictionary/definitions/lower-semicontinuous-setvalued) if $\liminf_{y \to x} f(y) \geq f(x)$.
  This is equivalent to outer semicontinuity of the epigraph map $x \mapsto [f(x), \infty)$, not to lower semicontinuity of a [set-valued map](/dictionary/definitions/set-valued-map).
