---
published: false
title: Eigenvalues vs. poles vs. zeros
kind: siblings
areas: [control, linear-algebra]
summary: >
  A linear system can be described by its state matrices or by its transfer function, and each description has its own special numbers.
  The [eigenvalues](/dictionary/definitions/eigenvalue) of the state matrix are the [poles](/dictionary/definitions/pole) of the transfer function only for a minimal realization.
  Canceled modes are eigenvalues but not poles, and they can hide an internal instability.
  Zeros are where the transfer function vanishes.
terms:
  - eigenvalue
  - pole
  - transmission_zero
examples_note: >-
  Each cell is the set of ___ of the system or transfer function in that row.
examples:
  - example: state_space_diag
    why: >-
      The eigenvalues of $A$ are $-1$ and $2$.
      The mode with eigenvalue $2$ is uncontrollable, so it does not appear in $G(s) = \frac{1}{s + 1}$, whose only pole is $-1$ and which has no zeros.
      So the system is BIBO stable but internally unstable.
  - example: transfer_nonminimum_phase
    why: >-
      The zero in the right half-plane makes the system non-minimum phase.
  - example: transfer_with_cancellation
see_also:
  - controllable_vs_reachable_vs_stabilizable
  - types_of_input_output_stability
  - types_of_nothing
---
## Notes

- "[Poles](/dictionary/definitions/pole)" and "[eigenvalues](/dictionary/definitions/eigenvalue)" are often used interchangeably, which is correct only for minimal realizations.
- The poles of the closed-loop system, not the open-loop system, determine closed-loop stability.
  Root locus plots show how the closed-loop poles move as a gain changes.
- A "zero" of a transfer function is a value of $s$, which is unrelated to the number $0$.
  See [types of nothing](/dictionary/distinctions/types-of-nothing).
