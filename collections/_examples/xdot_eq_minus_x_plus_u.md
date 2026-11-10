---
published: false
title: '$\dot{x} = -x + u$'
level: high-school
is: [
  autonomous_time_invariant,
  time_invariant,
  linear_system,
  affine_system,
  control_affine,
  feedback_linearizable
]
is_not: [
  autonomous_no_input,
  unforced
]
why:
  autonomous_time_invariant: >-
    $\dot{x} = -x + u$ is not autonomous in the sense of having no input, because it has the input $u$.
  time_invariant: >-
    $\dot{x} = -x + u$ is time-invariant because its right-hand side does not depend explicitly on $t$.
  unforced: >-
    $\dot{x} = -x + u$ is not unforced, because it has the input $u$; setting $u = 0$ gives an unforced system.
  feedback_linearizable: >-
    $\dot{x} = -x + u$ is a linear system, so it is also affine, control-affine, and feedback linearizable.
---
