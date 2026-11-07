---
published: false
title: Assumption vs. postulate vs. axiom
kind: family
areas: [language]
status: draft
summary: >
  An axiom is accepted without proof as a foundation of a whole theory, and "postulate" is an older synonym, used mainly in geometry.
  An assumption is a condition of one result, such as "$f$ is continuous" in a theorem about $f$.
terms:
  - assumption
  - postulate
  - axiom
examples:
  - example: parallel_postulate
    why: >-
      Euclid's parallel postulate is a postulate, and so an axiom, because Euclidean geometry takes it as given without proof.
      It is not an assumption of a single result; dropping it gives non-Euclidean geometries.
  - example: axiom_of_choice
    why: >-
      The axiom of choice is an axiom of set theory, because it cannot be proved from the other axioms (ZF) and is added to them.
      It is not an assumption of one result, though some authors state the results that need it separately.
  - example: continuity_in_the_intermediate_value_theorem
    why: >-
      "$f$ is continuous on $[a, b]$" is an assumption of the intermediate value theorem, because the theorem is proved only for continuous $f$.
      It is not an axiom or a postulate, because it is a condition on $f$, not a foundation of a theory.
  - example: every_vector_space_has_a_basis
    why: >-
      "Every vector space has a basis" is not an axiom or a postulate, because it is a theorem, proved from the axiom of choice (by Zorn's lemma).
see_also:
  - types_of_results
  - hypothesis_vs_theory
---
## Notes

- In mathematics, "hypothesis" usually means an assumption of a theorem, as in "the hypotheses of the theorem are satisfied."
  This differs from a [scientific hypothesis](/definitions/hypothesis-science); see [hypothesis vs. theory](/distinctions/hypothesis-vs-theory).
