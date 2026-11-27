---
published: false
title: '$x(t) = \max(1 - t, 0)$, for $\dot{x} = -\operatorname{sign}(x)$ with $\operatorname{sign}(0) = 1$'
level: graduate
figure:
  widget: function-plot
  params:
    var: t
    y_var: x
    x: [-0.5, 2.5]
    y: [-0.4, 1.4]
    curves:
      - { f: "(1 - t + abs(1 - t))/2", from: 0, ends: "[ ", label: "x(t)", label_at: 0.5 }
  caption: |-
    The solution $x(t) = \max(1 - t, 0)$, for $t \geq 0$.
  alt: "A line falling from (0, 1) to (1, 0), then staying at 0, with a corner at t = 1."
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
