---
published: false
title: '$\int_0^T W_t \mathrm{d}W_t$, for a Brownian motion $W$'
level: graduate
values:
  ito_integral: '$\int_0^T W_t \mathrm{d}W_t = \frac{1}{2} W_T^2 - \frac{1}{2} T$'
  stratonovich_integral: '$\int_0^T W_t \circ \mathrm{d}W_t = \frac{1}{2} W_T^2$'
  riemann_stieltjes_integral: 'None'
why:
  ito_integral: >-
    The Itô integral of $W$ with respect to itself is $\frac{1}{2} W_T^2 - \frac{1}{2} T$, because Itô's formula for $f(w) = w^2$ gives $\mathrm{d}(W_t^2) = 2 W_t \mathrm{d}W_t + \mathrm{d}t$.
  stratonovich_integral: >-
    The Stratonovich integral of $W$ with respect to itself is $\frac{1}{2} W_T^2$, as the ordinary chain rule predicts.
  riemann_stieltjes_integral: >-
    The integral of $W$ with respect to itself does not exist as a Riemann–Stieltjes integral, because Brownian motion has infinite total variation.
---
