---
title: 'A heated rod with one end in ice water and the other insulated'
level: high-school
is: [dirichlet_condition, neumann_condition]
is_not: [robin_condition]
why:
  robin_condition: >-
    The end in ice water has no Robin condition, which combines the value and the flux at the same point.
  dirichlet_condition: >-
    The end in ice water has a Dirichlet condition, and the insulated end has a Neumann condition, so this is a _mixed_ problem.
---
