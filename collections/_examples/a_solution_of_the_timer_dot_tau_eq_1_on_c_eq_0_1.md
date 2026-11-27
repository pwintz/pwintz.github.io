---
published: false
title: 'A maximal solution of the timer hybrid system $\dot{\tau} = 1$ on $C = [0, 1]$, $\tau^{+} = 0$ on $D = \setdef{1}$'
level: graduate
figure:
  widget: function-plot
  params:
    var: t
    y_var: '\tau'
    x: [-0.5, 5.8]
    y: [-0.3, 1.4]
    curves:
      - { f: "t", from: 0, to: 1, ends: "[]" }
      - { f: "t - 1", from: 1, to: 2, ends: "[]", same: true }
      - { f: "t - 2", from: 2, to: 3, ends: "[]", same: true }
      - { f: "t - 3", from: 3, to: 4, ends: "[]", same: true }
      - { f: "t - 4", from: 4, to: 5, ends: "[]", same: true }
      - { f: "t - 5", from: 5, to: 6, ends: "[ ", same: true }
  caption: |-
    The timer $\tau$ against the flow time $t$, starting from $\tau = 0$.
  alt: "A sawtooth: line segments rising from 0 to 1, each followed by a jump back to 0."
# Note: Solutions to the timer system are not inherently maximal---we can stop a solution prematurely. So, we need to consider a maximal solution to ensure it is complete.
is: [
  complete_solution,
  maximal_solution
]
is_not: [zeno_solution]
why:
  maximal_solution: >-
    A maximal solution of the timer is maximal by choice, since a solution of the timer that stops early is not maximal (see the restricted solution below).
  zeno_solution: >-
    A maximal solution of the timer is not Zeno, because it flows for one unit of time between jumps, so its flow time grows without bound.
  complete_solution: >-
    A maximal solution of the timer is complete, because the timer can always continue: it flows from $0$ to $1$, jumps back to $0$, and repeats, so a solution that stops can be extended.
---
