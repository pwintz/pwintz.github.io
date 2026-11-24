---
title: Passive System
term: passive
applies_to: input-output systems
levels:
  high-school:
    text: |-
      Consider a system that can receive [energy](/dictionary/definitions/energy) from outside, like a spring or a resistor.
      The system is _passive_ if it cannot produce energy on its own: it can only store or lose the energy that is put into it.
  undergraduate:
    context: physical systems
    text: |-
      Consider a physical system that stores [energy](/dictionary/definitions/energy) and receives energy through its input.
      The system is _passive_ if it cannot produce more energy than is supplied to it: the energy stored at every time is at most the initial stored energy plus the energy supplied through the input.

      Suppose that the system has a single input $u$ and a single output $y$ such that the [power](/dictionary/definitions/power) supplied to the system is $u y$.
      Then the system is _passive_ if there is a function $V$ of the state $\vect{x}$ such that $V(\vect{x}) \geq 0$ for all $\vect{x}$ and

      $$V(\vect{x}(t)) \leq V(\vect{x}(0)) + \int_0^t u(\tau) y(\tau) \, \diff{\tau}$$

      for all $t \geq 0$ along every solution.
      Here, $V(\vect{x})$ is the energy stored in the system when the state is $\vect{x}$, and the integral is the energy supplied through the input.
  graduate:
    context: nonlinear control
    text: |-
      Consider a system $\dot{\vect{x}} = f(\vect{x}, \vect{u})$ with output $\vect{y} = h(\vect{x}, \vect{u})$ such that $\vect{u}$ and $\vect{y}$ have the same dimension.
      The system is _passive_ if there exists a function $V$ such that

      $$\ip{\vect{u}}{\vect{y}} \geq \dot{V}(\vect{x}, \vect{u})$$

      for all $\vect{x}$ and $\vect{u}$.
      The function $V$ is called a [_storage function_](/dictionary/definitions/storage-function).
properties:
  - |-
    Every [lossless](/dictionary/definitions/lossless) system is passive.
  - |-
    The negative [feedback](/dictionary/definitions/feedback) connection of two passive systems is passive.
  - |-
    The parallel connection of two passive systems is passive.
  - |-
    If a passive system has a [positive definite](/dictionary/definitions/positive-definite-function) [storage function](/dictionary/definitions/storage-function), then the origin of the [unforced](/dictionary/definitions/unforced) system $\dot{\vect{x}} = f(\vect{x}, \vect{0})$ is [stable](/dictionary/definitions/lyapunov-stable).
  - |-
    If a system has a positive definite [storage function](/dictionary/definitions/storage-function) and is either [strictly passive](/dictionary/definitions/strictly-passive), or [output strictly passive](/dictionary/definitions/output-strictly-passive) and zero-state [observable](/dictionary/definitions/observable), then the origin of the [unforced](/dictionary/definitions/unforced) system $\dot{\vect{x}} = f(\vect{x}, \vect{0})$ is [asymptotically stable](/dictionary/definitions/asymptotically-stable).
  - |-
    If, in addition, the [storage function](/dictionary/definitions/storage-function) is radially unbounded, then the origin of the [unforced](/dictionary/definitions/unforced) system is [globally asymptotically stable](/dictionary/definitions/globally-asymptotically-stable).
  - |-
    If a system satisfies $\ip{\vect{u}}{\vect{y}} \geq \dot{V}(\vect{x}, \vect{u}) + \delta \ip{\vect{y}}{\vect{y}}$ for some $\delta > 0$, then the system has [finite $L_2$ gain](/dictionary/definitions/finite-l2-gain) of at most $1/\delta$.
  - |-
    A linear [time-invariant](/dictionary/definitions/time-invariant) system with a minimal realization and [transfer function](/dictionary/definitions/transfer-function) $G(s)$ is passive if and only if $G(s)$ is positive real.
  - |-
    A linear [time-invariant](/dictionary/definitions/time-invariant) system with a minimal realization and [transfer function](/dictionary/definitions/transfer-function) $G(s)$ is [strictly passive](/dictionary/definitions/strictly-passive) if and only if $G(s)$ is strictly positive real.
---
### The derivative of the storage function

The notation $\dot{V}(\vect{x}, \vect{u})$ denotes the derivative of $V$ along solutions of the system, given by

$$\dot{V}(\vect{x}, \vect{u}) = \ip{\nabla V(\vect{x})}{f(\vect{x}, \vect{u})}.$$

This derivative depends only on $\vect{x}$ and $\vect{u}$, so the inequality in the definition is a condition on each pair $(\vect{x}, \vect{u})$.

### Power and dimensions

In physical systems, the input $\vect{u}$ and output $\vect{y}$ are chosen so that each component of $\vect{u}$ pairs with a component of $\vect{y}$ whose product is [power](/dictionary/definitions/power), which is energy per unit time.
Examples are voltage and current in a circuit (volts times amperes is watts) and force and velocity for a mass (newtons times meters per second is watts).
Then the product $\ip{\vect{u}}{\vect{y}}$ is the power supplied to the system through its input.
Integrating the inequality in the definition over a time interval from $t_0$ to $t_1$ gives

$$\int_{t_0}^{t_1} \ip{\vect{u}}{\vect{y}} \, dt \geq V(\vect{x}(t_1)) - V(\vect{x}(t_0)).$$

The left side is the energy supplied to the system, and the right side is the increase in the stored energy.
For systems that are not physical, $\ip{\vect{u}}{\vect{y}}$ is called the supply rate.

This product is defined only when $\vect{u}$ and $\vect{y}$ have the same dimension, so passivity is a property only of systems with as many outputs as inputs.
The [storage function](/dictionary/definitions/storage-function) page defines the supply rate, the dissipativity inequality, and the [energy](/dictionary/definitions/energy) dissipated.

### Variants and related notions

[Strictly passive](/dictionary/definitions/strictly-passive), [input strictly passive](/dictionary/definitions/input-strictly-passive), and [output strictly passive](/dictionary/definitions/output-strictly-passive) systems dissipate energy in proportion to the state, the input, or the output, and a [lossless](/dictionary/definitions/lossless) system dissipates none.
See [Types of Passivity](/dictionary/distinctions/types-of-dynamic-passivity).
Passivity bounds the energy that a system can return, while [input-to-state stability](/dictionary/definitions/input-to-state-stable) bounds the size of the state.
See [Passive vs. Input-to-State Stable](/dictionary/distinctions/passive-vs-input-to-state-stable).
