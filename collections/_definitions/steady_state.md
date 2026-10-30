---
published: false
title: Steady state
term: steady state
applies_to: dynamical systems
synonyms: [steady-state response]
levels:
  elementary:
    text: |-
      The _steady state_ of a system is how it behaves after it settles down.
  high-school:
    text: |-
      The _steady state_ of a system is the behavior it settles into after its initial transients die out, such as a constant value or a steady oscillation.
  undergraduate:
    text: |-
      The _steady-state response_ of a stable system to an input is what remains of its response as $t \to \infty$, after the transient response (which depends on the initial state) decays.
properties:
  - >-
    For a stable linear [time-invariant](/definitions/time-invariant) system with transfer function $G(s)$, the steady-state response to $\sin(\omega t)$ is $\lvert G(i \omega) \rvert \sin(\omega t + \angle G(i \omega))$.
---
