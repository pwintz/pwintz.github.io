---
title: '$G(s) = \frac{1}{s + 2}$'
level: high-school
values:
  pole: '$s = -2$'
  transmission_zero: 'None'
  inverse_laplace_transform: '$g(t) = e^{-2 t}$ for $t \geq 0$'
why:
  inverse_laplace_transform: |-
    The inverse Laplace transform of $G(s) = 1 / (s + 2)$ is $g(t) = e^{-2 t}$, because the Laplace transform of $e^{-2 t}$ is

    $$\int_0^{\infty} e^{-2 t} e^{-s t} \dt = \frac{1}{s + 2}$$

    for every $s$ such that $\realpart{s} > -2$.
---
