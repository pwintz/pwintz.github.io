---
published: false
title: Event vs. random variable
kind: siblings
areas: [statistics]
summary: >
  Events and random variables both describe the result of a random experiment, but in different ways.
  An [event](/dictionary/definitions/event) is a set of outcomes, which either happens or does not, and it has a [probability](/dictionary/definitions/probability).
  A [random variable](/dictionary/definitions/random-variable) assigns a number to each outcome, and it has a distribution.
terms:
  - event
  - random_variable
examples:
  - example: roll_is_even
  - example: roll_of_a_die_as_a_number
  - example: indicator_of_even_roll
    why: >-
      The indicator of an event is a random variable that equals $1$ exactly when the event happens, so events and $0$/$1$ random variables carry the same information.
see_also:
  - probability_measure_vs_distribution_vs_density
---
## Notes

- Statements about a [random variable](/dictionary/definitions/random-variable) define events: $\setdef{X \leq 3}$ is the event that $X$ is at most $3$.
