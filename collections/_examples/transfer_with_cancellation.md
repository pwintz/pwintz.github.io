---
title: '$G(s) = \frac{s + 1}{(s + 1)(s + 2)}$'
level: high-school
values:
  pole: '$s = -2$'
  transmission_zero: 'None'

  # TODO: eigenvalues are defined for matrices and linear maps. What does it mean in this context? Should it be a separate definition?
  # eigenvalue: '$-2$, for a minimal realization; $-1$ and $-2$, for a realization built from the uncanceled form'
why:
  transmission_zero: >-
    $G(s) = \frac{s + 1}{(s + 1)(s + 2)}$ has no transmission zeros, because the factor $s + 1$ cancels.
  pole: >-
    The pole of $G(s)$ is $-2$, because 
    
    $$G(s) = \frac{1}{s + 2}$$
    
    after canceling $s + 1$.
  # eigenvalue: >-
  #   A realization built from the uncanceled form has $-1$ as an eigenvalue anyway.
---
