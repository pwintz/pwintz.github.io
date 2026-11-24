---
published: false
title: Heat Diffusion
term: heat diffusion
applies_to: heat
levels:
  elementary:
    text: |-
      _Heat diffusion_ is the slow spreading of heat through a material that stays in place, from hotter parts to colder parts, until the material has the same temperature everywhere.
      For example, when one end of a metal rod is held in a flame, the heat slowly spreads to the other end of the rod.
  high-school:
    text: |-
      Consider a still material, such as a metal rod or a pool of still water, whose temperature differs from place to place.
      _Heat diffusion_ is the evening out of the temperature as heat spreads from hotter regions to colder regions, passed from each molecule to its neighbors by collisions, while the molecules themselves stay in place on average.
  undergraduate:
    text: |-
      Consider a uniform, still material with temperature $T(\vect{x}, t)$, thermal conductivity $k$, density $\rho$, and specific heat capacity $c_p$.
      _Heat diffusion_ is the change of the temperature by [conduction](/dictionary/definitions/conduction), which follows the _heat equation_

      $$\frac{\partial T}{\partial t} = \alpha \nabla^2 T,$$

      where $\alpha = k / (\rho c_p)$ is the _thermal diffusivity_ of the material.
properties:
  - |-
    The heat equation follows from Fourier's law $\vect{q} = -k \nabla T$ for the heat flux and the conservation of [energy](/dictionary/definitions/energy).
  - |-
    The heat equation is the [diffusion](/dictionary/definitions/diffusion) equation, with the thermal diffusivity $\alpha$ in place of the diffusion coefficient.
  - |-
    In metals, free electrons carry most of the heat, so metals diffuse heat quickly.
  - |-
    The thermal diffusivity depends on how easily the material conducts heat and on how much heat the material must absorb to warm up.
    Air conducts heat about $25$ times worse than water, but air has a much smaller heat capacity per unit volume, so the thermal diffusivity of air, about $2 \times 10^{-5}$ m²/s, is about $150$ times that of water, about $1.4 \times 10^{-7}$ m²/s.
  - |-
    Heat diffusion conserves thermal [energy](/dictionary/definitions/energy), $\int \rho c_p T \dx$, not temperature.
---
### Heat diffusion vs. conduction

In a still material, heat diffusion and [conduction](/dictionary/definitions/conduction) are the same process.
"Conduction" names the flow of heat, which is set by the thermal conductivity $k$.
"Heat diffusion" names the resulting spreading of the temperature, which is set by the thermal diffusivity $\alpha$.

### Thermal diffusion

The phrase _thermal diffusion_ sometimes means heat diffusion, but in chemistry and physics, thermal [diffusion](/dictionary/definitions/diffusion) usually means the Soret effect: the [particle diffusion](/dictionary/definitions/particle-diffusion) of a substance that is driven by a difference in temperature rather than by a difference in concentration.
