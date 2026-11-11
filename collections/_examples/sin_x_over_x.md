---
title: '$f(x) = \frac{\sin x}{x}$, at $x = 0$'
level: high-school
values:
  limit_of_function: '$\lim_{x \to 0} f(x) = 1$'
  left_limit: '$\lim_{x \to 0^{-}} f(x) = 1$'
  right_limit: '$\lim_{x \to 0^{+}} f(x) = 1$'
is_not: [continuous]
why:
  # TODO: Show calculation for why the limit exists.
  limit_of_function: >-
    $f(0)$ is undefined, but the limit exists anyway.
  right_limit: >-
    $\frac{\sin x}{x}$ approaches $1$ from both sides of $0$, so the left limit, the right limit, and the limit are all $1$, even though $f(0)$ is undefined.
  continuous: >-
    The function is not continuous at $x = 0$ because $f(0)$ is undefined, so $x = 0$ is not in the domain of $f$.
---
