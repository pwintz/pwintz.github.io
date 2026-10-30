---
published: false
title: Time-invariant vs. unforced
kind: siblings
areas: [dynamics, control]
status: draft
summary: >
  A time-invariant system has no explicit dependence on time. An unforced system has no input or forcing term.
  Neither property implies the other.
terms:
  - time_invariant
  - unforced
examples:
  - example: xdot_eq_minus_x
    why: >-
      It has neither explicit time dependence nor an input.
  - example: xdot_eq_minus_x_plus_u
    why: >-
      It has an input. Setting $u = 0$ gives an unforced system.
  - example: xdot_eq_minus_t_x
    why: >-
      It has no input, but its right-hand side depends explicitly on $t$.
  - example: xdot_eq_minus_x_plus_sin_t
    why: >-
      The forcing term $\sin t$ makes it both time-varying and forced.
see_also:
  - meanings_of_autonomous
  - types_of_system_linearity
  - types_of_unchanging
---
## Notes

- "Autonomous" is not listed here because it has two conflicting meanings: time-invariant, or with no input. See [the meanings of "autonomous"](/distinctions/meanings-of-autonomous).
- Adding time as a state, with $\dot{\tau} = 1$, turns any time-varying system into a time-invariant one, so the distinction is about how a system is written, not what it can do.
