---
published: false
title: Mutually exclusive events
term: mutually exclusive
applies_to: events
synonyms: [disjoint events, incompatible events]
levels:
  high-school:
    text: |-
      Consider two [events](/dictionary/definitions/event) $A$ and $B$ of a random experiment.
      The events $A$ and $B$ are _mutually exclusive_ if no [outcome](/dictionary/definitions/outcome) belongs to both $A$ and $B$, so $A$ and $B$ cannot occur in the same experiment.
  undergraduate:
    context: probability
    text: |-
      Consider a probability space $(\Omega, \mathcal{F}, P)$.
      Two [events](/dictionary/definitions/event) $A$ and $B$ are _mutually exclusive_ if $A$ and $B$ are disjoint:

      $$A \cap B = \emptyset.$$
properties:
  - >-
    If $A$ and $B$ are mutually exclusive, then $P(A \cup B) = P(A) + P(B)$.
  - >-
    If $A$ and $B$ are mutually exclusive, $P(A) > 0$, and $P(B) > 0$, then $A$ and $B$ are not [independent](/dictionary/definitions/statistical-independence), because $P(A \cap B) = 0$ but $P(A) P(B) > 0$.
---
Several events $A_1, A_2, \dots$ are called mutually exclusive (or pairwise disjoint) if every two of them are mutually exclusive.
