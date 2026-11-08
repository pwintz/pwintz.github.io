---
title: Disjoint union
term: disjoint union (tagged)
applies_to: sets
synonyms: [tagged union, coproduct of sets, $\bigsqcup$]
levels:
  undergraduate:
    text: |-
      Consider two sets $A$ and $B$, which may overlap.
      The _disjoint union_ of $A$ and $B$ is a set that combines $A$ and $B$ while keeping the elements of $A$ apart from the elements of $B$:

      $$A \sqcup B = (\setdef{1} \times A) \cup (\setdef{2} \times B),$$

      so each element is tagged with the set it came from.
  # graduate:
  #   context: category theory
  #   text: |-
  #     Consider two sets $A$ and $B$ in the category of sets.
  #     Their _disjoint union_ is the coproduct: a set $A \sqcup B$ with injections $A \to A \sqcup B$ and $B \to A \sqcup B$ such that any pair of functions $A \to C$ and $B \to C$ factors uniquely through it.
---
