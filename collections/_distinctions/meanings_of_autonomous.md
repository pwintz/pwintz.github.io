---
published: false
title: "Autonomous: time-invariant vs. no input"
kind: conflicting
areas: [dynamics, control]
status: draft
summary: >
  "Autonomous" means time-invariant to some authors (no explicit dependence on $t$) and "has no input" to others.
  The two meanings disagree for time-varying systems without inputs and for time-invariant systems with inputs.
terms:
  - autonomous_time_invariant
  - autonomous_no_input
examples_note: >-
  Is the system autonomous in the ___ sense?
examples:
  - example: xdot_eq_minus_x
    why: >-
      $\dot{x} = -x$ is time-invariant because its right-hand side does not depend on $t$.
      It has no input, so it is autonomous in both senses.
  - example: xdot_eq_minus_x_plus_u
    why: >-
      $\dot{x} = -x + u$ is time-invariant because its right-hand side does not depend explicitly on $t$.
      It is not autonomous in the sense of having no input, because it has the input $u$.
  - example: xdot_eq_minus_t_x
    why: >-
      $\dot{x} = -t x$ has no input.
      It is not time-invariant, because its right-hand side depends explicitly on $t$.
see_also:
  - time_invariant_vs_unforced
---
## Avoiding the ambiguity

Say "time-invariant" or "with no input" instead of "autonomous."
These terms, and "unforced," are compared on [time-invariant vs. unforced](/distinctions/time-invariant-vs-unforced).
