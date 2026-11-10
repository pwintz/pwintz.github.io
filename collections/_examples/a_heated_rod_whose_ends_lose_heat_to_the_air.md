---
title: 'A heated rod whose ends lose heat to the air (Newton''s law of cooling)'
level: high-school
is: [robin_condition]
is_not: [
  dirichlet_condition,
  neumann_condition
]
why:
  robin_condition: >-
    The flux out of each end is proportional to the difference between $u$ and the air temperature, which is a Robin condition.
  dirichlet_condition: >-
    A heated rod whose ends lose heat to the air (Newton's law of cooling) is not a Dirichlet, because it combines the value and the flux.
  neumann_condition: >-
    A heated rod whose ends lose heat to the air (Newton's law of cooling) is not Neumann condition, because it combines the value and the flux.
---
