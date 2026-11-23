---
published: false
title: Comb Filter
term: comb filter
applies_to: signals
levels:
  undergraduate:
    context: signal processing
    text: |-
      A _comb filter_ is a [linear system](/dictionary/definitions/linear-system) that adds a signal $x(t)$ to a copy of $x(t)$ that is delayed by a time $\tau > 0$ and multiplied by a gain $g$:

      $$y(t) = x(t) + g \, x(t - \tau).$$
properties:
  - >-
    The [frequency](/dictionary/definitions/frequency-oscillation) response of the comb filter is $1 + g e^{-i \omega \tau}$, whose magnitude has evenly spaced peaks and dips along the frequency axis, like the teeth of a comb.
  - >-
    For $g = 1$, the sinusoids with frequencies $f = (k + 1/2) / \tau$ are canceled by [destructive interference](/dictionary/definitions/destructive-interference), for [integers](/dictionary/definitions/integer) $k \geq 0$.
    For $g = -1$, the sinusoids with frequencies $f = k / \tau$ are canceled, including the [frequency](/dictionary/definitions/frequency-oscillation) $0$.
  - >-
    A sound and the sound's [reflection](/dictionary/definitions/reflection-wave) from a flat surface reach a listener as a comb filter, where $\tau$ is the extra travel time of the reflection and $g$ is the [reflection coefficient](/dictionary/definitions/reflection-coefficient), reduced by the extra spreading.
    A hydrophone near the sea surface, where $g \approx -1$, hears low frequencies weakly for this reason, which is called the _Lloyd's mirror_ effect.
---
A _feedback comb filter_ adds a delayed copy of the output instead of the input: $y(t) = x(t) + g \, y(t - \tau)$.
