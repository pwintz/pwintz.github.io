---
published: false
title: '$V(x) = x^2$, for $\dot{x} = x$'
level: high-school
is_not: [
  lyapunov_function,
  control_lyapunov_function,
  iss_lyapunov_function
]
why:
  lyapunov_function: >-
    $V(x) = x^2$ is not a Lyapunov function for $\dot{x} = x$, because $\dot{V} = 2 x^2 > 0$.
    It is not a control or ISS Lyapunov function, because there is no input to change that.
---
