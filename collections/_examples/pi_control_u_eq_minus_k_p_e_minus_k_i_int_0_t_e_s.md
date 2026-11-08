---
published: false
title: 'PI control $u = -k_p e - k_i \int_0^t e(s) \mathrm{d}s$'
level: high-school
is: [dynamic_feedback]
is_not: [static_feedback]
why:
  dynamic_feedback: >-
    PI control is dynamic feedback because the integral is an internal controller state $z$, with $\dot{z} = e$.
  static_feedback: >-
    PI control is not static feedback, because the input depends on the history of the error, not only its current value.
---
