---
published: false
title: '$f(x) = 1 / \sqrt{x}$ on $(0, 1]$'
level: undergraduate
values:
  riemann_integral: 'None'
  improper_integral: '$\lim_{t \to 0^{+}} \int_t^1 x^{-1/2} \mathrm{d}x = \lim_{t \to 0^{+}} (2 - 2 \sqrt{t}) = 2$'
  lebesgue_integral: '$2$'
why:
  riemann_integral: >-
    The function $1 / \sqrt{x}$ has no Riemann integral on $[0, 1]$, because it is unbounded near $0$.
  lebesgue_integral: >-
    The Lebesgue integral of $1 / \sqrt{x}$ on $(0, 1]$ is $2$, the same as the improper integral, because the function is nonnegative.
---
