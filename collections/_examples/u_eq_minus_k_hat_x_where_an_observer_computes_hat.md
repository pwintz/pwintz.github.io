---
published: false
title: '$u = -K \hat{x}$, where an observer computes $\hat{x}$ from $y$'
level: undergraduate
is: [output_feedback]
is_not: [state_feedback]
why:
  output_feedback: >-
    $u = -K \hat{x}$ is output feedback because the observer's estimate $\hat{x}$ is computed from the output $y$, not from the state.
  state_feedback: >-
    By the separation principle, a stabilizing state feedback combined with a converging observer stabilizes the system.
---
