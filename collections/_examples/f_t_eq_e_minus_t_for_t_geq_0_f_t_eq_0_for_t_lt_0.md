---
title: '$f(t) = e^{-t}$ for $t \geq 0$, $f(t) = 0$ for $t < 0$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-3, 4]
    y: [-0.3, 1.3]
    var: t
    curves:
      - {"f": "0", "label": "f", "to": 0, "ends": " )"}
      - {"f": "exp(-t)", "same": true, "from": 0, "ends": "[ "}
  caption: |-
    The graph of $f(t) = e^{-t}$ for $t \geq 0$ and $f(t) = 0$ for $t < 0$.
  alt: "A graph along the axis for negative t, then jumping to height 1 at t = 0 and decaying toward the axis."
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
