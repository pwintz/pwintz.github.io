---
published: false
title: '$V(x) = x^2$, for $\dot{x} = -x + x^2 d$'
level: graduate
is: [lyapunov_function]
is_not: [iss_lyapunov_function]
why:
  lyapunov_function: >-
    $V(x) = x^2$ is a Lyapunov function for $\dot{x} = -x + x^2 d$ with $d = 0$, because then $\dot{V} = -2 x^2$.
    It is not an ISS Lyapunov function, because the constant input $d = 1$ makes solutions starting above $1$ blow up, so the system is not ISS.
---
