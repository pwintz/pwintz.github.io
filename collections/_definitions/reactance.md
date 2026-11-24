---
published: false
title: Reactance
term: reactance
applies_to: electric circuits
synonyms: ['$X$']
levels:
  high-school:
    text: |-
      Consider an inductor with inductance $L$ or a capacitor with capacitance $C$ in a circuit with an alternating current of [frequency](/dictionary/definitions/frequency-oscillation) $f$.
      The _reactance_ of the component is the ratio of the [amplitude](/dictionary/definitions/amplitude) of the voltage across the component to the amplitude of the current through the component, with a positive sign for an inductor and a negative sign for a capacitor:

      $$X_L = 2 \pi f L \quad \text{and} \quad X_C = -\frac{1}{2 \pi f C}.$$

      Reactance is measured in ohms (Ω).
  undergraduate:
    context: linear circuits
    text: |-
      Consider a linear electric circuit with two terminals and with [impedance](/dictionary/definitions/impedance) $Z(\omega)$ at angular [frequency](/dictionary/definitions/frequency-oscillation) $\omega$.
      The _reactance_ of the circuit at frequency $\omega$ is the imaginary part of the impedance:

      $$X(\omega) = \imagpart{Z(\omega)}.$$
properties:
  - |-
    An ideal inductor or capacitor stores [energy](/dictionary/definitions/energy) during part of each cycle and returns the energy during the rest of the cycle, so a reactance converts no energy into heat, unlike a [resistance](/dictionary/definitions/resistance).
  - |-
    In a component with positive reactance (inductive), the current lags behind the voltage, and in a component with negative reactance (capacitive), the current leads the voltage.
  - |-
    The reactance of an inductor grows with [frequency](/dictionary/definitions/frequency-oscillation), and the magnitude of the reactance of a capacitor shrinks with frequency.
    An inductor and a capacitor in series have total reactance $0$ at the _resonant frequency_ $\omega = 1 / \sqrt{L C}$.
---
Some textbooks give the reactance of a capacitor as the positive number $1 / (2 \pi f C)$ and keep track of the sign separately.
