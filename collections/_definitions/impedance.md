---
published: false
title: Impedance
term: impedance
applies_to: electric circuits
synonyms: ['$Z$']
levels:
  high-school:
    context: electric circuits
    text: |-
      Consider an electric circuit made of resistors, capacitors, and inductors, in which a voltage that oscillates like a sine [wave](/dictionary/definitions/wave) drives a current that oscillates at the same [frequency](/dictionary/definitions/frequency-oscillation).
      The _impedance_ of the circuit at that frequency consists of two numbers that describe how the current responds to the voltage:

      1. the ratio of the [amplitude](/dictionary/definitions/amplitude) of the voltage to the amplitude of the current, which is measured in ohms (Ω), and
      2. the [phase](/dictionary/definitions/phase-wave) shift, which is how far the peaks of the current lag behind the peaks of the voltage.
  undergraduate:
    context: linear circuits
    text: |-
      Consider a linear, [time-invariant](/dictionary/definitions/time-invariant) electric circuit with two terminals that is driven at angular [frequency](/dictionary/definitions/frequency-oscillation) $\omega$.
      In [steady state](/dictionary/definitions/steady-state), the voltage across the terminals is $\operatorname{Re}(V e^{i \omega t})$ and the current through the terminals is $\operatorname{Re}(I e^{i \omega t})$ for two complex numbers $V$ and $I$, called [phasors](/dictionary/definitions/phasor).
      The _impedance_ of the circuit at frequency $\omega$ is the complex number

      $$Z(\omega) = \frac{V}{I}.$$
properties:
  - >-
    The magnitude $\abs{Z(\omega)}$ is the ratio of the [amplitude](/dictionary/definitions/amplitude) of the voltage to the amplitude of the current, and the angle $\arg Z(\omega)$ is the [phase](/dictionary/definitions/phase-wave) by which the voltage leads the current.
  - >-
    The real part of $Z = R + i X$ is the [resistance](/dictionary/definitions/resistance) $R$, which dissipates [energy](/dictionary/definitions/energy), and the imaginary part is the [reactance](/dictionary/definitions/reactance) $X$, which stores energy and returns it each cycle.
  - >-
    A resistor with [resistance](/dictionary/definitions/resistance) $R$ has impedance $R$, an inductor with inductance $L$ has impedance $i \omega L$, and a capacitor with capacitance $C$ has impedance $1 / (i \omega C)$.
  - >-
    Impedances in series add.
    For impedances in parallel, the reciprocals add, so the reciprocal $Y = 1/Z$, called the [admittance](/dictionary/definitions/admittance), is used for parallel connections.
  - >-
    The impedance is the [transfer function](/dictionary/definitions/transfer-function) from current to voltage, evaluated at $s = i \omega$: if $V(s)$ and $I(s)$ are the [Laplace transforms](/dictionary/definitions/laplace-transform) of the voltage and the current, starting from rest, then $Z(\omega) = V(i \omega) / I(i \omega)$.
  - >-
    When a [wave](/dictionary/definitions/wave) passes between two media with [characteristic acoustic impedances](/dictionary/definitions/characteristic-acoustic-impedance) $Z_1$ and $Z_2$, the fraction of the wave that is [reflected](/dictionary/definitions/reflection-wave) depends on the mismatch between $Z_1$ and $Z_2$.
    If $Z_1 = Z_2$, then none of the wave is reflected.
---
### Notation

Electrical engineers write $j$ for the imaginary unit, as in $Z = R + j X$, because $i$ is used for current.

### Impedance of waves

The same idea applies to [waves](/dictionary/definitions/wave), where the impedance is the ratio of a "push" to the "flow" that the push produces.
For sound, the _specific acoustic impedance_ is the ratio of the sound pressure to the particle velocity.
For a plane sound wave, this ratio is the [characteristic acoustic impedance](/dictionary/definitions/characteristic-acoustic-impedance) of the medium,

$$Z = \rho c,$$

where $\rho$ is the density of the medium and $c$ is the speed of sound in the medium.
Water has a characteristic impedance about $3600$ times that of air, so nearly all of the sound in the ocean that reaches the sea surface is reflected back down.
