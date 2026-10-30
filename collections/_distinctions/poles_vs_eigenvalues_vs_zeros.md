---
published: false
title: Eigenvalues vs. poles vs. zeros
kind: siblings
areas: [control, linear-algebra]
status: draft
summary: >
  The poles of a transfer function are the eigenvalues of the state matrix only for a minimal realization. Canceled modes are eigenvalues but not poles,
  and they can hide an internal instability. Zeros are where the transfer function vanishes.
terms:
  - eigenvalue
  - pole
  - transmission_zero
examples_note: >-
  Each cell is the set of ___ of the system or transfer function in that row.
examples:
  - example: state_space_diag
    why: >-
      The transfer function is $G(s) = C (s I - A)^{-1} B = \frac{1}{s + 1}$. The mode with eigenvalue $2$ is uncontrollable, so it does not appear in $G(s)$. The system is BIBO stable but internally unstable.
  - example: transfer_nonminimum_phase
    why: >-
      A zero in the right half-plane makes the system non-minimum phase.
  - example: transfer_with_cancellation
    why: >-
      The common factor cancels, so $G(s) = \frac{1}{s + 2}$. A realization built from the uncanceled form has $-1$ as an eigenvalue anyway.
see_also:
  - controllable_vs_reachable_vs_stabilizable
  - types_of_input_output_stability
  - types_of_nothing
---
## Notes

- "Poles" and "eigenvalues" are often used interchangeably, which is correct only for minimal realizations.
- The poles of the closed-loop system, not the open-loop system, determine closed-loop stability. Root locus plots show how the closed-loop poles move as a gain changes.
- A "zero" of a transfer function is a value of $s$, which is unrelated to the number $0$. See [types of nothing](/distinctions/types-of-nothing).
