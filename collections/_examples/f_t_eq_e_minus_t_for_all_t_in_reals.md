---
title: '$f(t) = e^{-\abs{t}}$ for all $t \in \reals$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-4, 4]
    y: [-0.2, 1.3]
    var: t
    curves:
      - {"f": "exp(-abs(t))", "label": "f"}
  caption: |-
    The graph of $f(t) = e^{-\abs{t}}$.
  alt: "A tent-like curve with a sharp peak at height 1 at t = 0, falling toward the axis on both sides."
is: [fourier_transform]
values:
  fourier_transform: '$\hat{f}(\omega) = 2 / (1 + \omega^2)$'
why:
  fourier_transform: |-
    $f(t) = e^{-\abs{t}}$ has a Fourier transform because it is integrable on $\reals$.
    Splitting the integral at $t = 0$ gives

    $$
    \begin{aligned}
    \hat{f}(\omega) &= \int_{-\infty}^{0} e^{(1 - i \omega) t} \dt + \int_0^{\infty} e^{-(1 + i \omega) t} \dt \\
    &= \frac{1}{1 - i \omega} + \frac{1}{1 + i \omega} = \frac{2}{1 + \omega^2}.
    \end{aligned}
    $$

    The Fourier transform $\hat{f}$ is real and even because $f$ is real and even.
---
