---
published: false
title: Types of second-order PDEs
kind: siblings
areas: [differential-equations]
status: draft
summary: >
  Second-order PDEs are classified by the signs of the eigenvalues of their second-order coefficients, like conic sections.
  The type determines how information propagates and which boundary or initial conditions make sense.
terms:
  - elliptic_pde
  - parabolic_pde
  - hyperbolic_pde
examples:
  - example: laplace_equation_u_xx_plus_u_yy_eq_0
    why: >-
      The Laplace equation is elliptic because $A = C = 1$ and $B = 0$, so $B^2 - AC = -1 < 0$.
  - example: heat_equation_u_t_eq_u_xx
    why: >-
      The heat equation is parabolic because, in the variables $(t, x)$, its only second-order term is $u_{xx}$, so $B^2 - AC = 0$.
  - example: wave_equation_u_tt_eq_u_xx
    why: >-
      The wave equation is hyperbolic because $u_{tt} - u_{xx} = 0$ has $A = 1$ and $C = -1$, so $B^2 - AC = 1 > 0$.
  - example: tricomi_equation_y_u_xx_plus_u_yy_eq_0
    why: >-
      The Tricomi equation has $B^2 - AC = -y$, so it is elliptic for $y > 0$, parabolic on $y = 0$, and hyperbolic for $y < 0$.
      So the type of an equation can change from region to region.
see_also:
  - types_of_PDEs_boundary_conditions
  - types_of_PDEs_numeircal_well-posedness
---
## Notes

- The names come from conic sections: $A x^2 + 2B x y + C y^2 = 1$ is an ellipse, parabola, or hyperbola according to the same sign of $B^2 - AC$.
- Only the highest-order terms matter for the type.
