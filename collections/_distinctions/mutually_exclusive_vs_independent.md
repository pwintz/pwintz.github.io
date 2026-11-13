---
published: false
title: Mutually exclusive vs. independent events
kind: siblings
areas: [statistics]
summary: >
  Mutual exclusivity and independence each describe how two events of a random experiment are related, and the two properties are often confused because both sound like "the events have nothing to do with each other."
  Two events are [mutually exclusive](/dictionary/definitions/mutually-exclusive) if the events cannot occur together: $A \cap B = \emptyset$.
  Two events are [independent](/dictionary/definitions/statistical-independence) if knowing whether one occurred does not change the [probability](/dictionary/definitions/probability) of the other: $P(A \cap B) = P(A) P(B)$.
  Mutually exclusive events depend strongly on each other, because if one occurs, then the other does not, so no two events with positive probabilities are both mutually exclusive and independent.
terms:
  - mutually_exclusive
  - statistical_independence
examples:
  - example: die_even_and_odd
  - example: two_flips_heads_and_heads
  - example: die_at_most_2_and_even
    why: >-
      The events "the roll is at most $2$" and "the roll is even" share the outcome $2$, and they are independent, because they share exactly the right fraction of outcomes.
  - example: die_at_least_4_and_even
  - example: die_7_and_1
    why: >-
      The events "the roll is $7$" and "the roll is $1$" are both mutually exclusive and independent, which is possible only because the first event has probability $0$.
see_also:
  - correlation_vs_causation_vs_independence
  - random_variable_vs_event
---
