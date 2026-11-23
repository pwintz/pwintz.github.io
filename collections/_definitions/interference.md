---
published: false
title: Interference
term: interference
applies_to: waves
levels:
  elementary:
    text: |-
      _Interference_ is the combining of two [waves](/dictionary/definitions/wave) that pass through the same place at the same time.
      Where the peaks of one wave line up with the peaks of the other wave, the waves add up to a bigger wave.
      Where the peaks of one wave line up with the troughs of the other wave, the waves cancel each other.
  high-school:
    text: |-
      Consider two [waves](/dictionary/definitions/wave) that travel through the same place at the same time, such as the sound waves from two speakers.
      _Interference_ is the combination of the two waves in which the displacement at each point and time is the sum of the [displacements](/dictionary/definitions/displacement) of the two waves.
  undergraduate:
    context: linear waves
    text: |-
      Consider two [waves](/dictionary/definitions/wave) of the same angular [frequency](/dictionary/definitions/frequency-oscillation) $\omega$ that satisfy a linear wave equation, written as $\operatorname{Re}(A_1(x) e^{i \omega t})$ and $\operatorname{Re}(A_2(x) e^{i \omega t})$ with complex [amplitudes](/dictionary/definitions/amplitude) $A_1(x)$ and $A_2(x)$ at each point $x$.
      The sum of the two waves has complex amplitude $A_1 + A_2$, so the intensity of the sum is proportional to

      $$\abs{A_1 + A_2}^2 = \abs{A_1}^2 + \abs{A_2}^2 + 2 \abs{A_1} \abs{A_2} \cos(\phi_1 - \phi_2),$$

      where $\phi_1 = \arg A_1$ and $\phi_2 = \arg A_2$.
      _Interference_ is the difference between the intensity of the sum and the sum $\abs{A_1}^2 + \abs{A_2}^2$ of the separate intensities, which is given by the last term, called the _interference term_.
properties:
  - >-
    Two [waves](/dictionary/definitions/wave) have [constructive interference](/dictionary/definitions/constructive-interference) at a point where the waves are in [phase](/dictionary/definitions/phase-wave), so the amplitude of the sum is the sum of the [amplitudes](/dictionary/definitions/amplitude) $\abs{A_1} + \abs{A_2}$.
  - >-
    Two [waves](/dictionary/definitions/wave) have [destructive interference](/dictionary/definitions/destructive-interference) at a point where the waves are half a cycle out of [phase](/dictionary/definitions/phase-wave), so the amplitude of the sum is the difference $\abs{\abs{A_1} - \abs{A_2}}$ of the [amplitudes](/dictionary/definitions/amplitude).
    Two waves with equal amplitudes cancel at points of destructive interference.
  - >-
    Consider two sources that emit [waves](/dictionary/definitions/wave) with [wavelength](/dictionary/definitions/wavelength) $\lambda$ in [phase](/dictionary/definitions/phase-wave).
    At a point where the distances to the two sources differ by $\Delta$, the waves interfere constructively if $\Delta$ is an [integer](/dictionary/definitions/integer) multiple of $\lambda$, and destructively if $\Delta$ is an odd multiple of $\lambda / 2$.
  - >-
    Interference does not create or destroy [energy](/dictionary/definitions/energy).
    Interference moves energy from the points of [destructive interference](/dictionary/definitions/destructive-interference) to the points of [constructive interference](/dictionary/definitions/constructive-interference).
  - >-
    If the [phase](/dictionary/definitions/phase-wave) difference $\phi_1 - \phi_2$ varies randomly over time, then the interference term averages to zero, so the intensities add.
    [Waves](/dictionary/definitions/wave) with a fixed phase difference are called [coherent](/dictionary/definitions/coherent).
  - >-
    Two [waves](/dictionary/definitions/wave) with slightly different frequencies $f_1$ and $f_2$ alternate between constructive and [destructive interference](/dictionary/definitions/destructive-interference), so the loudness of the sum rises and falls at the [frequency](/dictionary/definitions/frequency-oscillation) $\abs{f_1 - f_2}$.
    This rise and fall of the loudness is called [beats](/dictionary/definitions/beats).
  - >-
    A [wave](/dictionary/definitions/wave) and a delayed copy of itself, such as a sound and its [reflection](/dictionary/definitions/reflection-wave) from a wall, interfere constructively at some frequencies and destructively at others, which makes a [comb filter](/dictionary/definitions/comb-filter).
---
### Other meanings of "interference"

In communications and signal processing, _interference_ means an unwanted signal that corrupts the desired signal, such as a radio station that drowns out another station on a nearby [frequency](/dictionary/definitions/frequency-oscillation).
This meaning is related but broader: the unwanted signal is added to the desired signal, but the two signals need not have the same frequency or a fixed [phase](/dictionary/definitions/phase-wave) difference.
