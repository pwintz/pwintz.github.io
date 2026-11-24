---
published: false
title: 'First-order lag $\dot{x} = -x + u$, $y = x$'
level: graduate
is: [
  passive,
  output_strictly_passive,
  strictly_passive,
  input_to_state_stable
]
is_not: [
  lossless,
  input_strictly_passive
]
why:
  output_strictly_passive: >-
    The first-order lag is output strictly passive, because its storage function $V = \frac{1}{2} x^2$, which is the energy stored in the state $x$, satisfies $u y = \dot{V} + y^2$.
  input_strictly_passive: >-
    The first-order lag is not input strictly passive, because $\realpart{\frac{1}{1 + i \omega}}$ tends to $0$ at high frequencies, so no $\delta u^2$ term is dissipated.
  passive: >-
    The first-order lag is passive, because its storage function $V = \frac{1}{2} x^2$, which is the energy stored in the state $x$, satisfies $u y = \dot{V} + y^2 \geq \dot{V}$.
  strictly_passive: >-
    The first-order lag is strictly passive, because the dissipated energy $y^2 = x^2$ is a positive definite function of the state.
  lossless: >-
    The first-order lag is not lossless, because the $y^2$ term in $u y = \dot{V} + y^2$ is dissipated.
  input_to_state_stable: >-
    The first-order lag is input-to-state stable, because it is a stable linear system.
---
