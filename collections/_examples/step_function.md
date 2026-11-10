---
published: false
title: 'The step function: $0$ for $x < 0$ and $1$ for $x \geq 0$'
level: undergraduate
is_not: [
  sequentially_continuous,
  continuous
]
values:
  limit_of_function: '$\lim_{x \to 0} f(x)$ does not exist'
  left_limit: '$\lim_{x \to 0^{-}} f(x) = 0$'
  right_limit: '$\lim_{x \to 0^{+}} f(x) = 1$'
why:
  sequentially_continuous: >-
    $x_n = -1/n \to 0$, but $f(x_n) = 0$ does not approach $f(0) = 1$.
  limit_of_function: >-
    The left and right limits differ.
  right_limit: >-
    The step function jumps at $0$, so its left limit is $0$ and its right limit is $1$.
---
