---
published: false
title: '$\dot{x} = A x + B u$, $y = C x$, with $A = \operatorname{diag}(-1, 2)$, $B = (1, 0)^{\top}$, $C = (1, 1)$'
level: undergraduate
values:
  eigenvalue: '$-1$ and $2$'
  pole: '$-1$'
  transmission_zero: 'None'
why:
  pole: >-
    The transfer function is $G(s) = C (s I - A)^{-1} B = \frac{1}{s + 1}$.
  eigenvalue: >-
    The mode with eigenvalue $2$ is uncontrollable, so it does not appear in the transfer function.
---
