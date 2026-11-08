---
published: false
title: '$x_{k+1} = 0 \cdot x_k + 0 \cdot u_k$'
level: undergraduate
is: [controllable, stabilizable]
is_not: [reachable]
why:
  reachable: >-
    $x_{k+1} = 0 \cdot x_k + 0 \cdot u_k$ is not reachable, because no nonzero state can be reached from $0$.
  controllable: >-
    $x_{k+1} = 0 \cdot x_k + 0 \cdot u_k$ is controllable (to the origin) because every state reaches $0$ after one step, and so it is also stabilizable.
---
