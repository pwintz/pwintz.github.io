---
published: false
title: '$x(t) = \max(1 - t, 0)$, for $\dot{x} = -\operatorname{sign}(x)$ with $\operatorname{sign}(0) = 1$'
level: graduate
is: [
  filippov_solution,
  krasovskii_solution,
  hermes_solution
]
is_not: [
  classical_solution,
  caratheodory_solution
]
why:
  hermes_solution: >-
    $x(t) = \max(1 - t, 0)$ is a Filippov, Krasovskii, and Hermes solution because these solutions slide along $x = 0$, where $0 \in [-1, 1]$.
  classical_solution: >-
    $x(t) = \max(1 - t, 0)$ is not a Carathéodory or classical solution, because for $t > 1$, $\dot{x} = 0 \neq f(0) = -1$.
---
