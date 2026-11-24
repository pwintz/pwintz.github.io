---
title: '$f(t) = e^{t}$ for $t \geq 0$'
level: undergraduate
values:
  laplace_transform: '$F(s) = 1 / (s - 1)$ for $\realpart{s} > 1$'
  fourier_transform: 'None'
why:
  laplace_transform: |-
    The Laplace transform of $f(t) = e^{t}$ for $t \geq 0$ is

    $$F(s) = \int_0^{\infty} e^{t} e^{-s t} \dt = \int_0^{\infty} e^{-(s - 1) t} \dt = \frac{1}{s - 1},$$

    where the integral converges if $\realpart{s} > 1$.
  fourier_transform: >-
    $f(t) = e^{t}$ has no Fourier transform, because the Fourier integral diverges.
---
