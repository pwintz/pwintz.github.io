---
published: false
title: '$x(t) = \max(1 - t, 0)$, for $\dot{x} = -\operatorname{sign}(x)$ with $\operatorname{sign}(0) = 0$'
level: graduate
is: [caratheodory_solution, filippov_solution, krasovskii_solution, hermes_solution]
is_not: [classical_solution]
why:
  classical_solution: >-
    $x(t) = \max(1 - t, 0)$ is not a classical solution, because it is not differentiable at $t = 1$.
  caratheodory_solution: >-
    $x(t) = \max(1 - t, 0)$ is a Carathéodory solution because the equation holds for every $t \neq 1$, so it is also a Filippov, Krasovskii, and Hermes solution.
---
