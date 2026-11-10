---
published: false
title: '$\dot{x} = x$, $y = d$'
level: undergraduate
is: [
  bibo_stable,
  finite_l2_gain
]
is_not: [input_to_state_stable]
why:
  bibo_stable: >-
    $\dot{x} = x$, $y = d$ is BIBO stable and has finite $L^2$ gain, because the output equals the input and ignores the state.
  input_to_state_stable: >-
    $\dot{x} = x$, $y = d$ is not input-to-state stable, because the state grows from every nonzero initial state.
---
