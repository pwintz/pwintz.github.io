---
published: false
title: 'A lead compensator $C(s) = \frac{s + 1}{s + 10}$'
level: undergraduate
is: [dynamic_feedback]
is_not: [static_feedback]
# TODO: Investigate and explain why this cannot be achieved with a static controller.
why:
  dynamic_feedback: >-
    The lead compensator is dynamic feedback because its transfer function is not constant, so it has an internal state.
  static_feedback: >-
    The lead compensator is not static feedback, because its output depends on the history of its input.
---
