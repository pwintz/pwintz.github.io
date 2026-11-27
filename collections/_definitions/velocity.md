---
title: Velocity
term: velocity
applies_to: moving objects
synonyms: ['$\vect{v}$']
levels:
  high-school:
    text: |-
      Consider an object that is moving, like a [ball](/dictionary/definitions/ball) rolling across a floor.
      The _velocity_ of the object is a [vector](/dictionary/definitions/vector) that points in the direction the object is moving and whose length is the speed of the object, which is the distance traveled per unit time.
  undergraduate:
    context: classical mechanics
    text: |-
      Consider a particle with position $\vect{x}(t)$ at time $t$.
      The _velocity_ of the particle is the rate of change of the position of the particle:

      $$\vect{v}(t) = \frac{\diff{\vect{x}}}{\diff{t}}.$$
  graduate:
    context: smooth manifolds
    text: |-
      Consider a [smooth](/dictionary/definitions/smooth) [manifold](/dictionary/definitions/manifold) $M$ and a smooth [curve](/dictionary/definitions/curve) $\gamma : I \to M$, where $I \subseteq \reals$ is an open interval.
      The _velocity_ of $\gamma$ at $t \in I$ is the tangent vector $\gamma^{\prime}(t)$ in the [tangent space](/dictionary/definitions/tangent-space) $T_{\gamma(t)} M$, viewed as a [derivation](/dictionary/definitions/derivation) at $\gamma(t)$, such that, for every smooth function $f : M \to \reals$,

      $$\gamma^{\prime}(t) f = (f \circ \gamma)^{\prime}(t).$$
properties:
  - |-
    The norm of velocity, $\norm{\vect{v}(t)}$, is the speed of the particle.
    
  - |-
    The [displacement](/dictionary/definitions/displacement) of the particle between times $t_0$ and $t_1$ is the integral of the velocity: 
    
    $$\int_{t_0}^{t_1} \vect{v}(t) \dt = \vect{x}(t_1) - \vect{x}(t_0).$$

  - |-
    The [momentum](/dictionary/definitions/momentum) of a particle with mass $m$ is $\vect{p} = m \vect{v}$.
  - |-
    In a chart with coordinates $(x^1, \dots, x^n)$, the velocity of the curve $\gamma$ with coordinate functions $\gamma^i = x^i \circ \gamma$ is

    $$\gamma^{\prime}(t) = \sum_{i=1}^{n} (\gamma^i)^{\prime}(t) \left. \frac{\partial}{\partial x^i} \right|_{\gamma(t)}.$$
  - |-
    If $M = \reals^n$ and each tangent space $T_x \reals^n$ is identified with $\reals^n$, then the velocity $\gamma^{\prime}(t)$ of a curve in a manifold is the derivative of $\gamma$, as in the undergraduate definition.
---
### Units

Velocity is measured in meters per second, $\mathrm{m} / \mathrm{s}$.
