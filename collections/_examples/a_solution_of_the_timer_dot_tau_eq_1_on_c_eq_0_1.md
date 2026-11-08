---
published: false
title: 'A maximal solution of the timer hybrid system $\dot{\tau} = 1$ on $C = [0, 1]$, $\tau^{+} = 0$ on $D = \setdef{1}$'
level: graduate
# Note: Solutions to the timer system are not inherently maximal---we can stop a solution prematurely. So, we need to consider a maximal solution to ensure it is complete.
is: [complete_solution]
is_not: [zeno_solution]
why:
  maximal_solution: >-
    A maximal solution of the timer is maximal by choice, since a solution of the timer that stops early is not maximal (see the restricted solution below).
  zeno_solution: >-
    A maximal solution of the timer is not Zeno, because it flows for one unit of time between jumps, so its flow time grows without bound.
  complete_solution: >-
    A maximal solution of the timer is complete, because the timer can always continue: it flows from $0$ to $1$, jumps back to $0$, and repeats, so a solution that stops can be extended.
---
