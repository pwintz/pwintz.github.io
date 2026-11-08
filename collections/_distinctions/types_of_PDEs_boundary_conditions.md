---
published: false
title: Types of boundary conditions
kind: siblings
areas: [differential-equations]
summary: >
  A partial differential equation on a region needs conditions on the boundary of the region, and these come in several types.
  A [Dirichlet](/definitions/dirichlet-condition) condition fixes the value on the boundary.
  A [Neumann](/definitions/neumann-condition) condition fixes the flux (normal derivative).
  A [Robin](/definitions/robin-condition) condition fixes a combination of the two.
terms:
  - dirichlet_condition
  - neumann_condition
  - robin_condition
examples_note: >-
  In each row, the temperature of the rod is modeled by the heat equation.
examples:
  - example: a_heated_rod_with_its_ends_held_in_ice_water
  - example: a_heated_rod_with_insulated_ends
  - example: a_heated_rod_whose_ends_lose_heat_to_the_air
  - example: a_heated_rod_with_one_end_in_ice_water_and_the
see_also:
  - types_of_PDEs_eigenvalue_classification
---
## Notes

- A _Cauchy_ condition specifies both the value and the normal derivative on the same part of the boundary.
  It is appropriate for [hyperbolic](/definitions/hyperbolic-pde) equations (like an initial position and velocity for the wave equation), but generally makes [elliptic](/definitions/elliptic-pde) problems ill-posed.
- For a pure [Neumann](/definitions/neumann-condition) problem for the Laplace equation, a solution exists only if the total flux is zero, and it is unique only up to an added constant.
