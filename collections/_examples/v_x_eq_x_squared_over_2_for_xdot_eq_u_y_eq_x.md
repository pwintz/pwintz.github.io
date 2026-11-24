---
published: false
title: '$V(x) = x^2/2$, for $\dot{x} = u$, $y = x$'
level: graduate
is: [storage_function]
is_not: [iss_lyapunov_function]
why:
  storage_function: >-
    $V(x) = x^2/2$ is a storage function for $\dot{x} = u$, $y = x$, because $\dot{V} = x u = u y$.
  iss_lyapunov_function: >-
    $V(x) = x^2/2$ is not an ISS-Lyapunov function for $\dot{x} = u$, because with $u = 0$, $\dot{V} = 0$, which is not at most $-\alpha_3(\abs{x})$ for any class-$\mathcal{K}_\infty$ function $\alpha_3$.
---
