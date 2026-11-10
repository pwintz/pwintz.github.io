---
published: false
title: '$V(x) = x^2$, for $\dot{x} = -x + d$'
level: graduate
is: [
  iss_lyapunov_function,
  lyapunov_function
]
why:
  lyapunov_function: >-
    $V(x) = x^2$ is an ISS Lyapunov function for $\dot{x} = -x + d$ because $\dot{V} = -2 x^2 + 2 x d \leq -x^2 + d^2$, since $2 x d \leq x^2 + d^2$.
    With $d = 0$, it is a Lyapunov function.
---
