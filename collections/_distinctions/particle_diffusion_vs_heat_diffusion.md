---
published: false
title: Particle Diffusion vs. Heat Diffusion
kind: siblings
areas: [physics, differential-equations]
summary: >
  Particle diffusion and heat diffusion both spread a quantity from where it is concentrated to where it is not, through a still material, and both follow the same [diffusion](/dictionary/definitions/diffusion) equation.
  In [particle diffusion](/dictionary/definitions/particle-diffusion), the molecules of a substance, such as a dye, travel from place to place, and the concentration of the substance evens out.
  In [heat diffusion](/dictionary/definitions/heat-diffusion), [energy](/dictionary/definitions/energy) is passed between neighboring molecules that stay in place on average, and the temperature evens out.
examples_note: >-
  Each cell is the result of the ___ in that row.
terms:
  - particle_diffusion
  - heat_diffusion
examples:
  - example: food_coloring_in_still_water
  - example: heat_spreading_along_a_metal_rod
  - example: sugar_and_heat_spreading_1_cm_through_still_water
    why: >-
      Sugar and heat spreading through still water follow the same diffusion equation, but the thermal diffusivity of water is about $300$ times the diffusion coefficient of sugar in water, so heat spreads $1$ cm in minutes and sugar spreads $1$ cm in days.
see_also:
  - diffusion_vs_scattering_vs_diffraction_vs_dispersion
---
## Notes

- Both kinds of [diffusion](/dictionary/definitions/diffusion) follow the diffusion equation $\partial u / \partial t = D \nabla^2 u$.
  For [particle diffusion](/dictionary/definitions/particle-diffusion), $u$ is the concentration $c$ and $D$ is the _diffusion coefficient_ (Fick's law $\vect{J} = -D \nabla c$).
  For [heat diffusion](/dictionary/definitions/heat-diffusion), $u$ is the temperature $T$ and $D$ is the _thermal diffusivity_ $\alpha = k / (\rho c_p)$ (Fourier's law $\vect{q} = -k \nabla T$), and the equation is called the _heat equation_.
- Particle diffusion conserves the amount of the substance, and heat diffusion conserves thermal [energy](/dictionary/definitions/energy).
- Particle diffusion needs particles that can move through the medium, so particle diffusion is very slow in solids.
  Heat diffusion happens in every material, and is fastest in metals, whose free electrons carry heat.
- In liquids, heat diffuses much faster than dissolved substances: the ratio $\alpha / D$, called the _Lewis number_, is about $100$ to $1000$ for substances dissolved in water.
  In gases, the two are about equally fast.
- In a still material, heat diffusion is the same process as [conduction](/dictionary/definitions/conduction).
- In a fluid that moves, [convection](/dictionary/definitions/convection) usually carries both heat and dissolved substances much faster than either kind of diffusion.
- "Thermal diffusion" sometimes means heat diffusion, but usually means the Soret effect, which is particle diffusion driven by a difference in temperature.
