---
published: false
title: Phase margin
term: phase margin
applies_to: feedback loops
levels:
  high-school:
    text: |-
      Consider a [feedback](/dictionary/definitions/feedback) loop, and extra phase lag that might be added to it, such as from a time delay.
      The _phase margin_ of the loop is how much extra phase lag the loop can tolerate before the [closed loop](/dictionary/definitions/closed-loop) becomes unstable.
  undergraduate:
    text: |-
      Consider a stable [feedback](/dictionary/definitions/feedback) loop with open-loop transfer function $L(s)$, whose magnitude crosses $1$ at the frequency $\omega_{g}$.
      The _phase margin_ of the loop is $180^{\circ} + \angle L(i \omega_{g})$.
properties:
  - >-
    A time delay $\tau$ reduces the phase of $L(i \omega)$ by $\omega \tau$ without changing its magnitude, so the loop tolerates delays up to the _delay margin_ $\tau = \mathrm{PM} / \omega_{g}$, with the phase margin $\mathrm{PM}$ in radians.
  - >-
    A larger phase margin generally means less overshoot and oscillation in the closed-loop step response.
---
