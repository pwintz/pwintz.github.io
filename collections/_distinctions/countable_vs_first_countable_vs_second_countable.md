---
title: Countable vs. First Countable vs. Second Countable
kind: siblings
areas: [topology, sets]
# The word "countable" appears in three conditions on spaces, but only "countable" itself is about the number of points.
summary: |-
  A [countable](/dictionary/definitions/countable) set has at most as many elements as $\nats$.
  A [first-countable](/dictionary/definitions/first-countable) space has a countable [neighborhood basis](/dictionary/definitions/neighborhood-basis) at each point.
  A [second-countable](/dictionary/definitions/second-countable) space has a countable [basis](/dictionary/definitions/topological-basis) for its whole [topology](/dictionary/definitions/topology).
  Every second-countable space is first countable:

  $$\text{second countable} \subset \text{first countable}.$$

  Every countable space that is first countable is second countable:

  $$\text{countable} \cap \text{first countable} \subset \text{second countable}.$$

  No other inclusion holds.
  A space can be countable without being first countable, first countable without being second countable, and second countable without being countable.
terms:
  - countable
  - first_countable
  - second_countable
examples:
  - example: rationals
  - example: reals_with_the_usual_topology
    why: >-
      $\reals$ with the standard topology is uncountable, but it is second countable.
      Second countability limits the number of basic open sets, not the number of points.
  - example: reals_with_the_discrete_topology
    why: >-
      $\reals$ with the discrete topology is first countable but not second countable.
      Each point needs only one neighborhood, $\setdef{x}$, but a basis for the whole space needs uncountably many open sets.
  - example: the_sorgenfrey_line_the_reals_with_half_open
  - example: reals_with_the_cofinite_topology
  - example: the_arens_fort_space
    why: >-
      The Arens–Fort space has only countably many points, but it is not first countable.
      First countability limits the number of neighborhoods needed at each point, not the number of points.
see_also:
  - finite_vs_countable_vs_uncountable
  - types_of_topological_spaces
---
## Notes

- If a space is [countable](/dictionary/definitions/countable) and [first countable](/dictionary/definitions/first-countable), then the space is [second countable](/dictionary/definitions/second-countable), because the [union](/dictionary/definitions/set-union) of countably many countable neighborhood bases, one at each point, is countable and forms a basis when the [neighborhoods](/dictionary/definitions/neighborhood) are open.
- The names come from Hausdorff, who called the two conditions the first and second axioms of countability.
