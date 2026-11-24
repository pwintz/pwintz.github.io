---
published: false
title: Convection
term: convection
applies_to: heat and substances in fluids
levels:
  elementary:
    text: |-
      _Convection_ is the movement of heat by a moving liquid or gas, which carries the heat along as the liquid or gas flows.
      For example, the water at the bottom of a pot on a stove warms, rises to the top, and carries heat with it.
  high-school:
    text: |-
      Consider a fluid, such as air or water, that flows between hot regions and cold regions.
      _Convection_ is the transfer of heat, or of a substance dissolved in the fluid, by the motion of the fluid as a whole, which carries the heat or the substance along with the fluid.
  undergraduate:
    text: |-
      Consider a quantity $u(\vect{x}, t)$, such as temperature or concentration, in a fluid that moves with velocity field $\vect{v}(\vect{x}, t)$.
      _Convection_ is the transport of $u$ by the flow of the fluid, which contributes the term $\vect{v} \cdot \nabla u$ to the _convection–diffusion equation_

      $$\frac{\partial u}{\partial t} + \vect{v} \cdot \nabla u = D \nabla^2 u.$$
properties:
  - |-
    In _natural convection_, the fluid moves because warm fluid is less dense than cool fluid and rises.
    In _forced convection_, the fluid is moved by something else, such as a fan or a pump.
  - |-
    Over long distances, convection usually carries heat much faster than [conduction](/dictionary/definitions/conduction) or [diffusion](/dictionary/definitions/diffusion).
  - |-
    (Newton's law of cooling.)
    The rate of heat transfer from a surface at temperature $T_s$ to a fluid at temperature $T_{\infty}$ is approximately $h A (T_s - T_{\infty})$, where $A$ is the area of the surface and $h$ is the _heat transfer coefficient_.
---
### "Convection" vs. "advection"

Many authors use _advection_ for the transport of a quantity by the bulk flow alone, the term $\vect{v} \cdot \nabla u$, and _convection_ for advection and [diffusion](/dictionary/definitions/diffusion) together.
In heat transfer, "convection" from a surface includes the [conduction](/dictionary/definitions/conduction) through the thin layer of fluid next to the surface.
