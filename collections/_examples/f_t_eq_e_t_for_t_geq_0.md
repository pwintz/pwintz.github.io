---
published: false
title: '$f(t) = e^{t}$ for $t \geq 0$'
level: undergraduate
is: [laplace_transform]
is_not: [fourier_transform]
why:
  laplace_transform: >-
    $f(t) = e^{t}$ has a Laplace transform because $\int_0^{\infty} e^{t} e^{-s t} \mathrm{d}t$ converges for $\operatorname{Re}(s) > 1$.
  fourier_transform: >-
    $f(t) = e^{t}$ has no Fourier transform, because the Fourier integral diverges.
---
