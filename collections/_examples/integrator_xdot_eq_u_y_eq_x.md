---
published: false
title: 'Integrator $\dot{x} = u$, $y = x$'
level: undergraduate
is: [
  passive,
  lossless
]
is_not: [
  input_strictly_passive,
  output_strictly_passive,
  strictly_passive,
  input_to_state_stable
]
why:
  strictly_passive: >-
    The integrator is not strictly passive, because it dissipates no energy: $\dot{V} = u y$ exactly, with $V = \frac{1}{2} x^2$.
  lossless: >-
    The integrator is lossless, because, with $V = \frac{1}{2} x^2$, $\dot{V} = x u = u y$ exactly.
  input_to_state_stable: >-
    The integrator is not input-to-state stable, because the constant input $u = 1$ produces the unbounded state $x(t) = x(0) + t$.
  passive: >-
    The integrator is passive, because, with $V = \frac{1}{2} x^2$, $\dot{V} = x u = u y$, so the stored energy $V$ grows by no more than the energy $u y$ supplied.
  input_strictly_passive: >-
    The integrator is not input strictly passive, because $\dot{V} = u y$ exactly, with $V = \frac{1}{2} x^2$, leaving no margin $\varepsilon u^2$.
  output_strictly_passive: >-
    The integrator is not output strictly passive, because $\dot{V} = u y$ exactly, with $V = \frac{1}{2} x^2$, leaving no margin $\varepsilon y^2$.
---
