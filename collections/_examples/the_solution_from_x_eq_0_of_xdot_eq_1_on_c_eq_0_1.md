---
published: false
title: 'The solution from $x = 0$ of $\dot{x} = 1$ on $C = [0, 1]$, with $D = \emptyset$'
level: graduate
figure:
  widget: function-plot
  params:
    var: t
    y_var: x
    x: [-0.5, 2]
    y: [-0.4, 1.5]
    curves:
      - { f: "t", from: 0, to: 1, ends: "[]", label: "x(t) = t", label_at: 0.6 }
      - { f: "1", color: 1, dash: true, label: "x = 1", label_at: 1.6 }
  caption: |-
    The solution $x(t) = t$, for $t$ from $0$ to $1$, with the line $x = 1$ (dashed).
  alt: "A line segment rising from (0, 0) to (1, 1), where it stops."
is: [maximal_solution]
is_not: [complete_solution]
why:
  maximal_solution: >-
    The solution from $x = 0$ is maximal because at $x = 1$ it can neither flow (it would leave $C$) nor jump ($D$ is empty), so it cannot be extended.
  complete_solution: >-
    The solution from $x = 0$ is not complete, because it stops at time $1$.
---
