---
title: '$f(t) = e^{-t}$ for $t \geq 0$, $f(t) = 0$ for $t < 0$'
level: undergraduate
values:
  laplace_transform: '$F(s) = 1 / (s + 1)$ for $\realpart{s} > -1$'
  fourier_transform: '$\hat{f}(\omega) = 1 / (1 + i \omega)$'
why:
  laplace_transform: |-
    The Laplace transform of $f(t) = e^{-t}$ for $t \geq 0$ is

    $$F(s) = \int_0^{\infty} e^{-t} e^{-s t} \dt = \int_0^{\infty} e^{-(s + 1) t} \dt = \frac{1}{s + 1},$$

    where the integral converges if $\realpart{s} > -1$.
  fourier_transform: |-
    The Fourier transform of $f$, which is $e^{-t}$ for $t \geq 0$ and $0$ for $t < 0$, is

    $$\hat{f}(\omega) = \int_0^{\infty} e^{-t} e^{-i \omega t} \dt = \frac{1}{1 + i \omega},$$

    where the integral converges for every real $\omega$ because $\abs{e^{-t} e^{-i \omega t}} = e^{-t}$.
---
