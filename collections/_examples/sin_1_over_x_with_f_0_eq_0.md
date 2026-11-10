---
published: false
title: '$f(x) = \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, at $x = 0$'
level: undergraduate
is: [oscillating_discontinuity]
is_not: [
  removable_discontinuity,
  jump_discontinuity,
  infinite_discontinuity
]
why:
  removable_discontinuity: >-
    $f(x) = \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, has no removable discontinuity at $0$, because $\lim_{x \to 0} \sin(1/x)$ does not exist, so no choice of $f(0)$ makes $f$ continuous.
  jump_discontinuity: >-
    $f(x) = \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, has no jump discontinuity at $0$, because neither one-sided limit at $0$ exists.
  infinite_discontinuity: >-
    $f(x) = \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, has no infinite discontinuity at $0$, because $\abs{f(x)} \leq 1$ for every $x$.
  oscillating_discontinuity: >-
    $f(x) = \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, has an oscillating discontinuity at $0$, because $f$ is bounded, but $f(x)$ takes the values $1$ and $-1$ at points $x = \frac{1}{\pi/2 + 2\pi n}$ and $x = \frac{1}{3\pi/2 + 2\pi n}$ arbitrarily close to $0$ on each side.
---
