---
title: Power
term: power
applies_to: physical systems
synonyms: ['$P$']
levels:
  high-school:
    text: |-
      Consider a physical system, such as a motor or a light bulb, that gains or loses [energy](/dictionary/definitions/energy) over time.
      The _power_ delivered to the system is the rate at which energy is transferred to the system, that is, the energy transferred per unit time.
      If the power is constant, then

      $$P = \frac{\Delta E}{\Delta t},$$

      where $\Delta E$ is the energy transferred to the system during a time interval of length $\Delta t$.
  undergraduate:
    context: classical mechanics
    text: |-
      Consider a system with [energy](/dictionary/definitions/energy) $E(t)$ at time $t$.
      The _power_ delivered to the system is the rate of change of the energy of the system:

      $$P(t) = \frac{\diff{E}}{\diff{t}}.$$
properties:
  - |-
    Power is a scalar, which can be negative.
    Negative power means that [energy](/dictionary/definitions/energy) leaves the system.
  - |-
    The [energy](/dictionary/definitions/energy) transferred to a system between times $t_0$ and $t_1$ is the integral of the power: 
    
    $$\int_{t_0}^{t_1} P(t) \dt = E(t_1) - E(t_0).$$
  - |-
    For a particle with [velocity](/dictionary/definitions/velocity) $\vect{v}$ and applied [force](/dictionary/definitions/force) $\vect{F}$, the power delivered to the particle is $P = \vect{F} \cdot \vect{v}$.
    The reason is that power is the rate at which the force does [work](/dictionary/definitions/work).
    The work done by the force during a small [displacement](/dictionary/definitions/displacement) $\diff{\vect{x}}$ is $\diff{W} = \vect{F} \cdot \diff{\vect{x}}$, so

    $$P = \frac{\diff{W}}{\diff{t}} = \vect{F} \cdot \frac{\diff{\vect{x}}}{\diff{t}} = \vect{F} \cdot \vect{v}.$$

  # TODO: Clarify where this comes from (the definition of voltage is the change in energy per unit of charge and current is charge per unit time, so the power is the volate times the current.)
  - |-
    For a component of an electrical circuit with voltage $V$ across the component and current $I$ through the component, the power delivered to the component is $P = V I$.
---
### Units

Power is measured in watts (W).
One watt is one joule per second, $1 \ \mathrm{J} / \mathrm{s}$, which is $1 \ \mathrm{kg} \cdot \mathrm{m}^2 / \mathrm{s}^3$.
For example, a [force](/dictionary/definitions/force) of one newton moving a particle at one meter per second delivers one watt, and one volt across a component with one ampere through the component delivers one watt.

### Power in input-output systems

For an input-output system whose input and output are chosen so that $\ip{\vect{u}}{\vect{y}}$ is power, the product $\ip{\vect{u}}{\vect{y}}$ is the power supplied to the system through the input.
See [passive](/dictionary/definitions/passive) and [storage function](/dictionary/definitions/storage-function), which compare this power with the rate of increase of the stored [energy](/dictionary/definitions/energy).
