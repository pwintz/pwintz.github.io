---
published: false
title: Types of boundary conditions
kind: siblings
areas: [differential-equations]
status: draft
summary: >
  A Dirichlet condition fixes the value on the boundary.
  A Neumann condition fixes the flux (normal derivative).
  A Robin condition fixes a combination of the two.
terms:
  - dirichlet_condition
  - neumann_condition
  - robin_condition
examples_note: >-
  In each row, the temperature of the rod is modeled by the heat equation.
examples:
  - example: a_heated_rod_with_its_ends_held_in_ice_water
    why: >-
      The ice water fixes the temperature at both ends, $u = 0$, which is a Dirichlet condition.
      It is not a Neumann or Robin condition, because it prescribes the value, not the flux.
  - example: a_heated_rod_with_insulated_ends
    why: >-
      No heat flows through the insulated ends, so $\frac{\partial u}{\partial n} = 0$, which is a Neumann condition.
      It is not a Dirichlet or Robin condition, because it prescribes the flux, not the value.
  - example: a_heated_rod_whose_ends_lose_heat_to_the_air
    why: >-
      The flux out of each end is proportional to the difference between $u$ and the air temperature, which is a Robin condition.
      It is not a Dirichlet or Neumann condition, because it combines the value and the flux.
  - example: a_heated_rod_with_one_end_in_ice_water_and_the
    why: >-
      The end in ice water has a Dirichlet condition, and the insulated end has a Neumann condition, so this is a _mixed_ problem.
      It has no Robin condition, which combines the value and the flux at the same point.
see_also:
  - types_of_PDEs_eigenvalue_classification
---
## Notes

- A _Cauchy_ condition specifies both the value and the normal derivative on the same part of the boundary.
  It is appropriate for hyperbolic equations (like an initial position and velocity for the wave equation), but generally makes elliptic problems ill-posed.
- For a pure Neumann problem for the Laplace equation, a solution exists only if the total flux is zero, and it is unique only up to an added constant.
