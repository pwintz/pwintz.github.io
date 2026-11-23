---
published: false
title: Conduction
term: conduction
applies_to: heat
levels:
  elementary:
    text: |-
      _Conduction_ is the movement of heat through a material, or between two objects that touch, from the hotter part to the colder part, without the material moving.
      For example, the handle of a metal spoon in a bowl of hot soup gets hot by conduction.
  high-school:
    text: |-
      Consider an object, such as a metal rod, whose temperature differs from place to place.
      _Conduction_ is the flow of heat through the object from hotter regions to colder regions, by collisions between neighboring molecules and electrons, without any motion of the material as a whole.
  undergraduate:
    text: |-
      Consider a material with temperature $T(\vect{x}, t)$.
      _Conduction_ is the transfer of heat with a heat flux $\vect{q}$ that is proportional to the negative [gradient](/dictionary/definitions/gradient) of the temperature (Fourier's law),

      $$\vect{q} = -k \nabla T,$$

      where $k > 0$ is the _thermal conductivity_ of the material.
properties:
  - |-
    In a uniform material without heat sources, the temperature satisfies the _heat equation_

    $$\frac{\partial T}{\partial t} = \alpha \nabla^2 T,$$

    where $\alpha = k / (\rho c_p)$ is the _thermal diffusivity_, $\rho$ is the density, and $c_p$ is the specific heat capacity.
    The heat equation is the diffusion equation, so conduction in a still material is [heat diffusion](/dictionary/definitions/heat-diffusion).
  - >-
    Metals conduct heat well, and still air conducts heat poorly, which is why materials that trap air, such as foam and down feathers, are good insulators.
  - >-
    Thermal conductivity is measured in watts per meter per kelvin (W/(m·K)).
  - >-
    Heat is also conducted in liquids and gases, but in a fluid that can move, [convection](/dictionary/definitions/convection) usually carries much more heat than conduction.
---
### Electrical conduction

_Electrical conduction_ is the flow of electric charge through a material, with current density $\vect{J} = \sigma \vect{E}$ proportional to the electric field $\vect{E}$, where $\sigma$ is the _electrical conductivity_ (Ohm's law).
In metals, the same free electrons carry heat and charge, so good conductors of electricity are usually good conductors of heat.
