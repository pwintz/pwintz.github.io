---
published: false
title: Itô integral
term: Itô integral
applies_to: random processes
levels:
  graduate:
    context: stochastic calculus
    text: |-
      Consider a [Brownian motion](/dictionary/definitions/brownian-motion) $W$ and a random process $H$ that does not look into the future (it is adapted).
      The _Itô integral_ of $H$ with respect to $W$ is the limit of sums that evaluate $H$ at the _left_ endpoint of each subinterval:

      $$\int_0^T H_t \mathrm{d}W_t = \lim \sum_{k = 1}^{n} H_{t_{k-1}} \bigl(W_{t_k} - W_{t_{k-1}}\bigr).$$
properties:
  - >-
    A [Riemann–Stieltjes integral](/dictionary/definitions/riemann-stieltjes-integral) with respect to $W$ does not exist, because $W$ has infinite total variation, so the choice of evaluation point matters even in the limit.
  - >-
    The Itô integral has mean $0$, and it satisfies Itô's formula, a chain rule with an extra second-order term: $\mathrm{d}f(W_t) = f^{\prime}(W_t) \mathrm{d}W_t + \frac{1}{2} f^{\prime\prime}(W_t) \mathrm{d}t$.
---
