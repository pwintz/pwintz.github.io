---
published: false
title: Types of boundary conditions
kind: siblings
areas: [differential-equations]
status: draft
summary: >
  A Dirichlet condition fixes the value on the boundary. A Neumann condition fixes the flux (normal derivative). A Robin condition fixes a combination of the two.
terms:
  - dirichlet_condition
  - neumann_condition
  - robin_condition
examples_note: >-
  In each row, the temperature of the rod is modeled by the heat equation.
examples:
  - example: a_heated_rod_with_its_ends_held_in_ice_water
    why: >-
      $u = 0$ at both ends.
  - example: a_heated_rod_with_insulated_ends
    why: >-
      No heat flows through the ends, so $\frac{\partial u}{\partial n} = 0$.
  - example: a_heated_rod_whose_ends_lose_heat_to_the_air
    why: >-
      The flux out is proportional to the difference between $u$ and the air temperature.
  - example: a_heated_rod_with_one_end_in_ice_water_and_the
    why: >-
      This is a _mixed_ problem, with different types on different parts of the boundary. It is not a Robin condition, which combines value and flux at the same point.
see_also:
  - types_of_PDEs_eigenvalue_classification
---
## Notes

- A _Cauchy_ condition specifies both the value and the normal derivative on the same part of the boundary. It is appropriate for hyperbolic equations (like an initial position and velocity for the wave equation), but generally makes elliptic problems ill-posed.
- For a pure Neumann problem for the Laplace equation, a solution exists only if the total flux is zero, and it is unique only up to an added constant.
