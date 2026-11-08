---
published: false
title: "Continuity: metric vs. sequential vs. topological"
kind: hierarchy
areas: [topology, analysis]
summary: >
  Continuity can be defined with distances, with sequences, or with [open sets](/definitions/open-set).
  The ε-δ definition of continuity (for [metric spaces](/definitions/metric-space)) and the open-set definition (for topological spaces) agree on metric spaces.
  In metric spaces, continuity is also equivalent to sequential continuity, but in general topological spaces, sequential continuity is weaker.
relation: >
  continuous ⊂ sequentially continuous, with equality for functions on metric spaces (and, more generally, first-countable spaces).
terms:
  - continuous
  - sequentially_continuous
examples:
  - example: x_sq_on_reals
    why: >-
      The two definitions agree for functions between metric spaces, such as $x \mapsto x^2$ on $\reals$.
  - example: the_identity_map_from_reals_with_the_co_countable
see_also:
  - types_of_continuous
  - continuous_vs_open
---
## Notes

- Use the level switcher above to compare the [metric](/definitions/metric) (undergraduate) and topological (graduate) definitions of "[continuous](/definitions/continuous)."
- The open-set definition, applied to a metric space with the [topology](/definitions/topology) from its metric, is equivalent to the ε-δ definition.
  So the graduate definition generalizes the undergraduate one without changing it.
- Sequential continuity is equivalent to continuity for functions on first-countable spaces, which include all [metric spaces](/definitions/metric-space).
