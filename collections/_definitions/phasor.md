---
published: false
title: Phasor
term: phasor
applies_to: sinusoids
levels:
  undergraduate:
    text: |-
      Consider a sinusoid with [amplitude](/dictionary/definitions/amplitude) $A$, angular [frequency](/dictionary/definitions/frequency-oscillation) $\omega$, and [phase](/dictionary/definitions/phase-wave) offset $\phi$:

      $$y(t) = A \cos(\omega t + \phi).$$

      The _phasor_ of $y$ is the complex number

      $$\hat{y} = A e^{i \phi},$$

      so that $y(t) = \operatorname{Re}(\hat{y} e^{i \omega t})$.
properties:
  - >-
    The magnitude of the phasor $\hat{y}$ is the [amplitude](/dictionary/definitions/amplitude) of $y$, and the argument of $\hat{y}$ is the [phase](/dictionary/definitions/phase-wave) offset of $y$.
  - >-
    The sum of two sinusoids with the same [frequency](/dictionary/definitions/frequency-oscillation) is a sinusoid whose phasor is the sum of the two phasors.
  - >-
    Differentiating a sinusoid with respect to time multiplies its phasor by $i \omega$, so phasors turn linear differential equations with sinusoidal inputs into algebraic equations.
  - >-
    The [impedance](/dictionary/definitions/impedance) of a circuit is the ratio of the voltage phasor to the current phasor.
---
Some authors, especially in power engineering, scale phasors by $1 / \sqrt{2}$, so that the magnitude of the phasor is the root-mean-square value of the sinusoid instead of its [amplitude](/dictionary/definitions/amplitude).
