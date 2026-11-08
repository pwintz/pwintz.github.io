---
published: false
title: '$V(x) = x^2$, for $\dot{x} = x + u$'
level: graduate
is: [control_lyapunov_function]
is_not: [lyapunov_function]
why:
  control_lyapunov_function: >-
    $V(x) = x^2$ is a control Lyapunov function for $\dot{x} = x + u$ because the input $u = -2x$ gives $\dot{V} = -2 x^2 < 0$.
  lyapunov_function: >-
    $V(x) = x^2$ is not a Lyapunov function, because with $u = 0$, $\dot{V} = 2 x^2 > 0$.
---
