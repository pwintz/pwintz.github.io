---
title: 'Exponential decay $\dot{x} = -x$, starting from $x_0 = 1$'
level: undergraduate
figure:
  widget: function-plot
  params:
    var: t
    y_var: x
    x: [-1, 4]
    y: [-0.3, 3]
    curves:
      - { f: "exp(-t)", label: "x(t) = e^{-t}" }
    points:
      - { at: [0, 1] }
  caption: |-
    The trajectory $x(t) = e^{-t}$, with $x(0) = 1$ (dot).
  alt: "A decaying exponential curve through the point (0, 1)."
values:
  trajectory: '$x(t) = e^{-t}$'
  orbit: '$\mathcal{O}(1) = (0, \infty)$'
  flow: '$\varphi(t, x_0) = x_0 e^{-t}$'
why:
  trajectory: >-
    The trajectory of $\dot{x} = -x$ from $x_0 = 1$ is $x(t) = e^{-t}$, because $\frac{\diff{}}{\dt} e^{-t} = -e^{-t}$ and $e^{0} = 1$.
  orbit: >-
    The orbit of $1$ for $\dot{x} = -x$ is the interval $(0, \infty)$, because $e^{-t}$ takes every positive value exactly once as $t$ runs over $\reals$.
    The forward orbit, for $t \geq 0$, is $(0, 1]$.
  flow: >-
    The flow of $\dot{x} = -x$ is $\varphi(t, x_0) = x_0 e^{-t}$, which shrinks every initial state by the factor $e^{-t}$ in the time $t$.
---
