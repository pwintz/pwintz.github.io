---
published: false
title: Stratonovich integral
term: Stratonovich integral
applies_to: random processes
levels:
  graduate:
    context: stochastic calculus
    text: |-
      Consider a [Brownian motion](/dictionary/definitions/brownian-motion) $W$ and a random process $H$.
      The _Stratonovich integral_ of $H$ with respect to $W$ is the limit of sums that average $H$ over the two endpoints of each subinterval:

      $$\int_0^T H_t \circ \mathrm{d}W_t = \lim \sum_{k = 1}^{n} \frac{H_{t_{k-1}} + H_{t_k}}{2} \bigl(W_{t_k} - W_{t_{k-1}}\bigr).$$
properties:
  - >-
    The Stratonovich integral satisfies the ordinary chain rule, $\mathrm{d}f(W_t) = f^{\prime}(W_t) \circ \mathrm{d}W_t$, which makes it natural in physics and on manifolds.
---
