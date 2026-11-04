---
published: false
title: "Continuity: metric vs. sequential vs. topological"
kind: hierarchy
areas: [topology, analysis]
status: draft
summary: >
  The ε-δ definition of continuity (for metric spaces) and the open-set definition (for topological spaces) agree on metric spaces.
  In metric spaces, continuity is also equivalent to sequential continuity, but in general topological spaces, sequential continuity is weaker.
relation: >
  continuous ⊂ sequentially continuous, with equality for functions on metric spaces (and, more generally, first-countable spaces).
terms:
  - continuous
  - sequentially_continuous
examples:
  - example: square_on_reals
    why: >-
      $x \mapsto x^2$ is continuous and sequentially continuous.
      The two definitions agree for functions between metric spaces.
  - example: the_identity_map_from_reals_with_the_co_countable
    why: >-
      This identity map is sequentially continuous because only eventually constant sequences converge in the co-countable topology.
      It is not continuous, because every singleton is open in the discrete topology, but its preimage is not open in the co-countable topology.
see_also:
  - types_of_continuous
  - continuous_vs_open
---
## Notes

- Use the level switcher above to compare the metric (undergraduate) and topological (graduate) definitions of "continuous."
- The open-set definition, applied to a metric space with the topology from its metric, is equivalent to the ε-δ definition.
  So the graduate definition generalizes the undergraduate one without changing it.
- Sequential continuity is equivalent to continuity for functions on first-countable spaces, which include all metric spaces.
