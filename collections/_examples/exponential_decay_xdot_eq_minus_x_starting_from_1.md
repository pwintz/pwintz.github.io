---
published: false
title: 'Exponential decay $\dot{x} = -x$, starting from $x_0 = 1$'
level: undergraduate
values:
  trajectory: '$x(t) = e^{-t}$'
  orbit: '$\mathcal{O}(1) = (0, \infty)$'
  flow: '$\varphi(t, x_0) = x_0 e^{-t}$'
why:
  trajectory: >-
    The trajectory of $\dot{x} = -x$ from $x_0 = 1$ is $x(t) = e^{-t}$, because $\frac{\mathrm{d}}{\mathrm{d}t} e^{-t} = -e^{-t}$ and $e^{0} = 1$.
  orbit: >-
    The orbit of $1$ for $\dot{x} = -x$ is the interval $(0, \infty)$, because $e^{-t}$ takes every positive value exactly once as $t$ runs over $\reals$.
    The forward orbit, for $t \geq 0$, is $(0, 1]$.
  flow: >-
    The flow of $\dot{x} = -x$ is $\varphi(t, x_0) = x_0 e^{-t}$, which shrinks every initial state by the factor $e^{-t}$ in the time $t$.
---
