---
published: false
title: Particle Diffusion
term: particle diffusion
applies_to: substances
synonyms: [mass diffusion, molecular diffusion]
levels:
  elementary:
    text: |-
      _Particle diffusion_ is the slow spreading of the tiny particles of a substance, such as the molecules of a dye or of a smell, from where there are many particles to where there are few, as each particle wanders randomly.
      For example, a drop of food coloring in a glass of still water slowly spreads until the whole glass has the same color.
  high-school:
    text: |-
      Consider a substance, such as a dye or a gas, that is spread unevenly through a still fluid or a solid.
      _Particle diffusion_ is the spreading of the substance from regions of high concentration to regions of low concentration, caused by the random motion of the molecules of the substance, which travel from place to place.
  undergraduate:
    text: |-
      Consider the concentration $c(\vect{x}, t)$ of a substance in a still medium.
      _Particle diffusion_ is the transport of the substance with a flux $\vect{J}$ that is proportional to the negative [gradient](/dictionary/definitions/gradient) of the concentration (Fick's law),

      $$\vect{J} = -D \nabla c,$$

      where $D > 0$ is the _diffusion coefficient_ of the substance in the medium.
properties:
  - >-
    The concentration of a substance that spreads by particle diffusion satisfies the [diffusion](/dictionary/definitions/diffusion) equation $\partial c / \partial t = D \nabla^2 c$, which is Fick's second law.
  - >-
    Each particle moves by a [random walk](/dictionary/definitions/random-walk), called _Brownian motion_, and its mean squared [displacement](/dictionary/definitions/displacement) along each axis grows as $2 D t$.
  - |-
    Larger particles diffuse more slowly: a [sphere](/dictionary/definitions/sphere) of radius $r$ in a fluid with viscosity $\eta$ at absolute temperature $T$ has the diffusion coefficient

    $$D = \frac{k_B T}{6 \pi \eta r}$$

    (the Stokes–Einstein relation), where $k_B$ is Boltzmann's constant.
  - >-
    The diffusion coefficient of a small molecule is about $10^{-5}$ m²/s in air and about $10^{-9}$ m²/s in water, so particle diffusion is about $10{,}000$ times faster in air.
  - >-
    Particle diffusion conserves the amount of the substance: the total amount $\int c \dx$ does not change.
---
