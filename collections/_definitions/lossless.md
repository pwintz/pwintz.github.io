---
title: Lossless System
term: lossless
applies_to: input-output systems
levels:
  high-school:
    text: |-
      Consider a system that receives [energy](/dictionary/definitions/energy) from outside, like a spring being stretched.
      The system is _lossless_ if it stores all of the energy put into it and loses none.
  graduate:
    context: nonlinear control
    text: |-
      Consider a [passive](/dictionary/definitions/passive) system $\dot{\vect{x}} = f(\vect{x}, \vect{u})$ with output $\vect{y} = h(\vect{x}, \vect{u})$ and [storage function](/dictionary/definitions/storage-function) $V$.
      The system is _lossless_ if all supplied [energy](/dictionary/definitions/energy) is stored, and none is dissipated:

      $$\ip{\vect{u}}{\vect{y}} = \dot{V}(\vect{x}, \vect{u})$$

      for all $\vect{x}$ and $\vect{u}$.
---
### The derivative of the storage function

The notation $\dot{V}(\vect{x}, \vect{u})$ denotes the derivative of $V$ along solutions of the system, given by

$$\dot{V}(\vect{x}, \vect{u}) = \ip{\nabla V(\vect{x})}{f(\vect{x}, \vect{u})}.$$

This derivative depends only on $\vect{x}$ and $\vect{u}$, so the equation in the definition is a condition on each pair $(\vect{x}, \vect{u})$.
