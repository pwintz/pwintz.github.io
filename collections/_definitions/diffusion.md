---
title: Diffusion
term: diffusion
applies_to: substances and heat
levels:
  elementary:
    text: |-
      _Diffusion_ is the slow spreading of something, such as a dye or heat, from where there is more of it to where there is less of it, caused by the random jiggling of molecules.
      For example, a drop of food coloring in a glass of still water slowly spreads until the whole glass has the same color.
  high-school:
    text: |-
      Consider a quantity, such as the amount of a dye or the amount of heat, that is spread unevenly through a still material.
      _Diffusion_ is the spreading of the quantity from regions of high concentration to regions of low concentration, caused by the random motion of molecules, without any flow of the material as a whole.
  undergraduate:
    text: |-
      Consider a quantity with density $u(\vect{x}, t)$ in a still medium, such as the concentration of a substance or the thermal [energy](/dictionary/definitions/energy) per unit volume.
      _Diffusion_ is the transport of the quantity with a flux $\vect{J}$ that is proportional to the negative [gradient](/dictionary/definitions/gradient) of the density:

      $$\vect{J} = -D \nabla u,$$

      where $D > 0$ is the _diffusivity_.
properties:
  - |-
    The density of a diffusing quantity satisfies the _diffusion equation_

    $$\frac{\partial u}{\partial t} = D \nabla^2 u,$$

    which is a [parabolic PDE](/dictionary/definitions/parabolic-pde).
  - |-
    In a time $t$, a diffusing quantity spreads a distance of about $\sqrt{D t}$.
    Diffusion is fast over short distances but slow over long distances: a distance that is $10$ times longer takes $100$ times as long.
  - |-
    The two most common kinds of diffusion are [particle diffusion](/dictionary/definitions/particle-diffusion), in which molecules of a substance wander from place to place, and [heat diffusion](/dictionary/definitions/heat-diffusion), in which [energy](/dictionary/definitions/energy) is passed between neighboring molecules.
  - |-
    Diffusion smooths out differences: the diffusion equation turns every initial density into a smoother one, and the maximum of the density does not increase.
---
### Other meanings of "diffusion"

- In [probability](/dictionary/definitions/probability), a _diffusion process_ is a [random process](/dictionary/definitions/stochastic-process) with [continuous](/dictionary/definitions/continuous) paths, such as [Brownian motion](/dictionary/definitions/brownian-motion), that is described by a stochastic differential equation.
- In optics and acoustics, _diffuse_ means spread in many directions by [scattering](/dictionary/definitions/scattering), as in "diffuse reflection," which is not caused by diffusion.
