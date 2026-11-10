---
published: false
title: 'FTCS for $u_t = u_{xx}$ with $r > \frac{1}{2}$'
level: undergraduate
is: [consistent_scheme]
is_not: [
  stable_scheme,
  convergent_scheme
]
why:
  consistent_scheme: >-
    FTCS for the heat equation is consistent.
  convergent_scheme: >-
    With $r > \frac{1}{2}$, it is not stable, because errors at high frequencies are amplified at every step, so it is not convergent.
---
