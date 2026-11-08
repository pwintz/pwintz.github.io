---
title: '$x \mapsto \abs{x_1} + \abs{x_2}$ on $\reals^2$'
level: undergraduate
is: [norm]
is_not: [inner_product]
why:
  norm: >-
    $x \mapsto \abs{x_1} + \abs{x_2}$ is a norm.
  inner_product: >-
    $x \mapsto \abs{x_1} + \abs{x_2}$ does not come from an inner product, because it fails the parallelogram law: with $x = (1, 0)$ and $y = (0, 1)$, $\norm{x + y}^2 + \norm{x - y}^2 = 8$, but $2 \norm{x}^2 + 2 \norm{y}^2 = 4$.
---
