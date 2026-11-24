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
    The integrator is not strictly passive in any sense, because no energy is dissipated.
  lossless: >-
    The integrator is passive and lossless because, with $V = \frac{1}{2} x^2$, $\dot{V} = x u = u y$ exactly.
  input_to_state_stable: >-
    The integrator is not input-to-state stable, because the constant input $u = 1$ produces the unbounded state $x(t) = x(0) + t$.
---
