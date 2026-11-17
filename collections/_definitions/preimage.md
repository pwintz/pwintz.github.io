---
title: Preimage
term: preimage
applies_to: functions and sets
synonyms: [inverse image, "$f^{-1}$"]
levels:
  high-school:
    text: |-
      Consider a function $f$ and a set $B$ of possible outputs.
      The _preimage_ of $B$ under $f$ is the set of all inputs $x$ whose output $f(x)$ is in $B$.
  undergraduate:
    text: |-
      Consider a function $f : X \to Y$ and a set $B \subseteq Y$.
      The _preimage_ of $B$ is

      $$f^{-1}(B) = \setdef{x \in X \suchthat f(x) \in B}.$$
properties:
  - >-
    For a function $f : X \to \reals$, the $c$-[level set](/dictionary/definitions/level-set) of $f$ is the preimage $f^{-1}(\setdef{c})$ of a single point, and the $c$-[sublevel set](/dictionary/definitions/sublevel-set) of $f$ is the preimage $f^{-1}((-\infty, c])$ of an interval.
  - >-
    Preimages preserve unions, intersections, and complements: $f^{-1}(A \cup B) = f^{-1}(A) \cup f^{-1}(B)$, $f^{-1}(A \cap B) = f^{-1}(A) \cap f^{-1}(B)$, and $f^{-1}(Y \setminus B) = X \setminus f^{-1}(B)$.
    [Images](/dictionary/definitions/image) preserve unions, but not always intersections or complements.
---
The preimage is always defined, even for functions with no inverse.