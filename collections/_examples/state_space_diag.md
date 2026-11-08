---
published: false
title: '$\dot{x} = A x + B u$, $y = C x$, with $A = \operatorname{diag}(-1, 2)$, $B = (1, 0)^{\top}$, $C = (1, 1)$'
level: undergraduate
values:
  eigenvalue: 'The eigenvalues of $A$, $-1$ and $2$'
  pole: '$s = -1$'
  transmission_zero: 'None'
why:
  transmission_zero: >-
    The system has no transmission zeros, because its transfer function $G(s) = \frac{1}{s + 1}$ has a constant numerator.
  pole: >-
    The pole of the system is $-1$, because its transfer function is $G(s) = C (s I - A)^{-1} B = \frac{1}{s + 1}$.
    The transfer function is $G(s) = C (s I - A)^{-1} B = \frac{1}{s + 1}$.
  eigenvalue: >-
    The mode with eigenvalue $2$ is uncontrollable, so it does not appear in the transfer function.
---
