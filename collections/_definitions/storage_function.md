---
published: false
title: Storage Function
term: storage function
applies_to: input-output systems
levels:
  undergraduate:
    context: physical systems
    text: |-
      Consider a physical system that stores [energy](/dictionary/definitions/energy) and receives energy through its input.
      A _storage function_ for the system is a function $V \geq 0$ of the state of the system such that the rate of increase of $V$ is at most the power supplied through the input.
  graduate:
    context: nonlinear control
    text: |-
      Consider a system $\dot{x} = f(x, u)$ with output $y = h(x, u)$ such that $u$ and $y$ have the same dimension.
      A _storage function_ for the system is a [continuously differentiable](/dictionary/definitions/continuously-differentiable) function $V$ such that $V(x) \geq 0$ for all $x$ and

      $$\nabla V(x) \cdot f(x, u) \leq u\trans h(x, u)$$

      for all $x$ and $u$.
      Along solutions, this inequality is written $\dot{V} \leq u\trans y$.
properties:
  - |-
    A system is [passive](/dictionary/definitions/passive) if and only if it has a storage function.
  - |-
    If a storage function $V$ is [positive definite](/dictionary/definitions/positive-definite-function), then $V$ is a [Lyapunov function](/dictionary/definitions/lyapunov-function) for the [unforced](/dictionary/definitions/unforced) system $\dot{x} = f(x, 0)$, because $u = 0$ gives $\dot{V} \leq 0$.
  - |-
    A system can have many storage functions: if $V$ is a storage function, then $V + c$ is a storage function for every constant $c \geq 0$.
---
### Supply rate and dissipation

The quantity $u\trans y$ is the _supply rate_, which is the instantaneous power supplied through the input in a physical system, such as voltage times current in a circuit or force times velocity in a mechanical system.
The derivative $\dot{V}$ is the _storage rate_.
Integrating the inequality $u\trans y \geq \dot{V}$ from $0$ to $t$ gives the _dissipativity inequality_

$$\int_0^t u(\tau)\trans y(\tau) \, d\tau \geq V(x(t)) - V(x(0)).$$

The [energy](/dictionary/definitions/energy) supplied up to time $t$ is at least the increase in stored energy.
The difference between the two sides is the energy dissipated up to time $t$.
Writing this energy as $D(t) \geq 0$ gives the _dissipation equality_

$$\int_0^t u(\tau)\trans y(\tau) \, d\tau = V(x(t)) - V(x(0)) + D(t).$$

### Other supply rates

A storage function can be defined for a supply rate $w(u, y)$ other than $u\trans y$ by requiring $\dot{V} \leq w(u, y)$.
This more general notion is called _dissipativity_.
The supply rate $w(u, y) = \gamma^2 \norm{u}^2 - \norm{y}^2$ gives a [finite $L_2$ gain](/dictionary/definitions/finite-l2-gain) of at most $\gamma$.
The supply rate $w(x, d) = \sigma(\norm{d}) - \alpha_3(\norm{x})$ gives an [ISS-Lyapunov function](/dictionary/definitions/iss-lyapunov-function).
See [Storage Function vs. ISS-Lyapunov Function](/dictionary/distinctions/storage-function-vs-iss-lyapunov-function).
