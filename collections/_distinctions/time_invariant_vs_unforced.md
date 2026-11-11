---
published: false
title: Time-invariant vs. unforced
kind: siblings
areas: [dynamics, control]
summary: >
  A differential equation can depend on things other than its state, such as time or an input.
  A [time-invariant](/dictionary/definitions/time-invariant) system has no explicit dependence on time.
  An [unforced](/dictionary/definitions/unforced) system has no input or forcing term.
  Neither property implies the other.
terms:
  - time_invariant
  - unforced
examples:
  - example: xdot_eq_minus_x
  - example: xdot_eq_minus_x_plus_u
  - example: xdot_eq_minus_t_x
  - example: xdot_eq_minus_x_plus_sin_t
see_also:
  - meanings_of_autonomous
  - types_of_system_linearity
  - types_of_unchanging
---
## Notes

- "Autonomous" is not listed here because it has two conflicting meanings: [time-invariant](/dictionary/definitions/time-invariant), or with no input.
  See [the meanings of "autonomous"](/dictionary/distinctions/meanings-of-autonomous).
- Adding time as a state, with $\dot{\tau} = 1$, turns every time-varying system into a time-invariant one, so the distinction is about how a system is written, not what it can do.
