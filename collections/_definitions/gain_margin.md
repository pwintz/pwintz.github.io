---
published: false
title: Gain margin
term: gain margin
applies_to: feedback loops
levels:
  high-school:
    text: |-
      Consider a [feedback](/dictionary/definitions/feedback) loop whose loop gain can be turned up or down.
      The _gain margin_ of the loop is the factor by which the loop gain can be increased before the [closed loop](/dictionary/definitions/closed-loop) becomes unstable.
  undergraduate:
    text: |-
      Consider a stable [feedback](/dictionary/definitions/feedback) loop with open-loop transfer function $L(s)$, whose phase crosses $-180^{\circ}$ at the frequency $\omega_{p}$.
      The _gain margin_ of the loop is $1 / \abs{L(i \omega_{p})}$, often given in decibels as $-20 \log_{10} \abs{L(i \omega_{p})}$.
properties:
  - >-
    If the phase of $L$ does not reach $-180^{\circ}$ at any frequency, then the gain margin is infinite.
  - >-
    The formula assumes a single phase crossover and a stable [open loop](/dictionary/definitions/open-loop).
    In general, the margins should be read from the [Nyquist](/dictionary/definitions/nyquist-criterion) plot.
---
