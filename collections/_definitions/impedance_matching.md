---
published: false
title: Impedance Matching
term: impedance matching
applies_to: circuits and waves
levels:
  high-school:
    text: |-
      Consider two parts of a system that [energy](/dictionary/definitions/energy) passes between, such as an amplifier that drives a speaker, or two materials that a sound [wave](/dictionary/definitions/wave) passes between.
      _Impedance matching_ is the design of the connection between the two parts so that the [impedances](/dictionary/definitions/impedance) of the parts are equal, which lets the most energy pass from one part to the other.
  undergraduate:
    context: linear circuits
    text: |-
      Consider a source with [impedance](/dictionary/definitions/impedance) $Z_s$ that drives a load with impedance $Z_L$.
      _Impedance matching_ is the choice of $Z_L$, or of a circuit between the source and the load, so that the load receives the most power, which happens when

      $$Z_L = \conj{Z_s}.$$
properties:
  - >-
    For a [wave](/dictionary/definitions/wave) that travels along a transmission line with characteristic impedance $Z_0$, a load with [impedance](/dictionary/definitions/impedance) $Z_L = Z_0$ absorbs the whole wave, so no wave is [reflected](/dictionary/definitions/reflection-wave) back along the line.
  - >-
    A layer with [impedance](/dictionary/definitions/impedance) $\sqrt{Z_1 Z_2}$ and thickness a quarter of a [wavelength](/dictionary/definitions/wavelength) passes a [wave](/dictionary/definitions/wave) from a medium with impedance $Z_1$ into a medium with impedance $Z_2$ without reflection, at one [frequency](/dictionary/definitions/frequency-oscillation).
  - >-
    The bones of the middle ear match the low [impedance](/dictionary/definitions/impedance) of air to the high impedance of the fluid in the inner ear.
    The gel used in ultrasound imaging removes the layer of air between the probe and the skin, which would otherwise reflect nearly all of the sound.
---
When $Z_s$ is real, matching for the most power and matching for no reflection both require $Z_L = Z_s$.
When $Z_s$ is complex, the two kinds of matching differ: the most power requires $Z_L = \conj{Z_s}$, but no reflection requires $Z_L = Z_s$.
