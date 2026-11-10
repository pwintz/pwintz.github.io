---
title: 'The step function: $0$ for $x < 0$ and $1$ for $x \geq 0$'
level: undergraduate
is: [jump_discontinuity]
is_not: [
  sequentially_continuous, 
  continuous, 
  removable_discontinuity, 
  infinite_discontinuity, 
  oscillating_discontinuity
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
  jump_discontinuity: >-
    The step function has a jump discontinuity at $0$, because the left limit at $0$ is $0$ and the right limit at $0$ is $1$.
  removable_discontinuity: >-
    The step function has no removable discontinuity at $0$, because its left and right limits at $0$ differ, so $\lim_{x \to 0} f(x)$ does not exist.
  infinite_discontinuity: >-
    The step function has no infinite discontinuity at $0$, because its values are only $0$ and $1$.
  oscillating_discontinuity: >-
    The step function has no oscillating discontinuity at $0$, because both one-sided limits at $0$ exist.
---
