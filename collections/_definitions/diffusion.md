---
published: false
title: Diffusion
term: diffusion
applies_to: substances and heat
levels:
  elementary:
    text: |-
      _Diffusion_ is the slow spreading of a substance from where there is a lot of the substance to where there is less of the substance, caused by the random jiggling of molecules.
      For example, a drop of food coloring in a glass of still water slowly spreads until the whole glass has the same color.
  high-school:
    text: |-
      Consider a substance, such as a dye or a gas, that is spread unevenly through a still fluid or a solid.
      _Diffusion_ is the spreading of the substance from regions of high concentration to regions of low concentration, caused by the random motion of molecules, without any flow of the fluid as a whole.
  undergraduate:
    text: |-
      Consider the concentration $u(\vect{x}, t)$ of a substance in a still medium.
      _Diffusion_ is the transport of the substance with a flux $\vect{J}$ that is proportional to the negative [gradient](/dictionary/definitions/gradient) of the concentration (Fick's law),

      $$\vect{J} = -D \nabla u,$$

      where $D > 0$ is the _diffusion coefficient_.
properties:
  - >-
    The concentration of a diffusing substance satisfies the _diffusion equation_

    $$\frac{\partial u}{\partial t} = D \nabla^2 u,$$

    which is a [parabolic PDE](/dictionary/definitions/parabolic-pde).
  - >-
    In a time $t$, a diffusing substance spreads a distance of about $\sqrt{D t}$.
    Diffusion is fast over short distances but slow over long distances: a distance that is $10$ times longer takes $100$ times as long.
  - >-
    The [conduction](/dictionary/definitions/conduction) of heat is the diffusion of heat: the temperature satisfies the diffusion equation, which is then called the _heat equation_.
  - >-
    Diffusion is the average behavior of many particles that each move by a [random walk](/dictionary/definitions/random-walk), which is called _Brownian motion_.
---
### Other meanings of "diffusion"

- In [probability](/dictionary/definitions/probability), a _diffusion process_ is a [random process](/dictionary/definitions/stochastic-process) with [continuous](/dictionary/definitions/continuous) paths, such as [Brownian motion](/dictionary/definitions/brownian-motion), that is described by a stochastic differential equation.
- In optics and acoustics, _diffuse_ means spread in many directions by [scattering](/dictionary/definitions/scattering), as in "diffuse reflection," which is not caused by diffusion.
