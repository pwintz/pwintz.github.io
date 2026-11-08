---
published: false
title: 'First-order lag $\dot{x} = -x + u$, $y = x$'
level: graduate
is: [passive, output_strictly_passive, strictly_passive]
is_not: [lossless, input_strictly_passive]
why:
  output_strictly_passive: >-
    The first-order lag is passive and output strictly passive because, with $V = \frac{1}{2} x^2$, $u y = \dot{V} + y^2$, and it is strictly passive.
  input_strictly_passive: >-
    First-order lag $\dot{x} = -x + u$, $y = x$, is not lossless, because the $y^2$ term is dissipated, and it is not input strictly passive, because $\operatorname{Re} \frac{1}{1 + i \omega}$ tends to $0$ at high frequencies.
---
