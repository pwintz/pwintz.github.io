---
title: 'A heated rod with its ends held in ice water'
level: high-school
is: [dirichlet_condition]
is_not: [
  neumann_condition,
  robin_condition
]
why:
  dirichlet_condition: >-
    The ice water fixes the temperature at both ends, $u = 0$, which is a Dirichlet condition.
  neumann_condition: >-
    A heated rod with its ends held in ice water is not a Neumann, because it prescribes the value, not the flux.
  robin_condition: >-
    A heated rod with its ends held in ice water is not Robin condition, because it prescribes the value, not the flux.
---
