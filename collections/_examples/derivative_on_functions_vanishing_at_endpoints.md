---
published: false
title: 'The derivative $D f = f^{\prime}$, on smooth functions $f$ on $[0, 1]$ such that $f(0) = f(1) = 0$, with the inner product $\ip{f}{g} = \int_0^1 f(x) g(x) \, \mathrm{d}x$'
level: graduate
values:
  adjoint: '$D^{\ast} g = -g^{\prime}$'
why:
  adjoint: >-
    The adjoint of the derivative $D$ on functions that vanish at $0$ and $1$ is $D^{\ast} = -D$, because integration by parts gives $\int_0^1 f^{\prime} g \, \mathrm{d}x = f(1) g(1) - f(0) g(0) - \int_0^1 f g^{\prime} \, \mathrm{d}x = \int_0^1 f \, (-g^{\prime}) \, \mathrm{d}x$ for every smooth $g$.
---
