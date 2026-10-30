---
published: false
title: Gain margin
term: gain margin
applies_to: feedback loops
levels:
  high-school:
    text: |-
      The _gain margin_ of a [feedback](/definitions/feedback) loop is the factor by which the loop gain can be increased before the [closed loop](/definitions/closed-loop) becomes unstable.
  undergraduate:
    text: |-
      For a stable [feedback](/definitions/feedback) loop with open-loop transfer function $L(s)$, whose phase crosses $-180^{\circ}$ at the frequency $\omega_{p}$, the _gain margin_ is $1 / \lvert L(i \omega_{p}) \rvert$, often given in decibels as $-20 \log_{10} \lvert L(i \omega_{p}) \rvert$.
properties:
  - >-
    If the phase of $L$ never reaches $-180^{\circ}$, the gain margin is infinite.
  - >-
    The formula assumes a single phase crossover and a stable open loop. In general, the margins should be read from the [Nyquist](/definitions/nyquist-criterion) plot.
---
