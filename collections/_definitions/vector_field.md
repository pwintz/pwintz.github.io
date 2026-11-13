---
title: Vector field
term: vector field
applies_to: regions of space and manifolds
levels:
  high-school:
    text: |-
      Consider a region of the plane or of space.
      A _vector field_ on the region is a rule that attaches a [vector](/dictionary/definitions/vector) (an arrow) to each point of the region, such as the velocity of the wind at each point of a map.
  undergraduate:
    text: |-
      Consider an open set $U$ in $\reals^n$.
      A _vector field_ on $U$ is a function $F : U \to \reals^n$, whose value $F(x)$ is thought of as a vector attached to the point $x$.
  graduate:
    context: differential geometry
    text: |-
      Consider a smooth manifold $M$ with tangent bundle $\pi : T M \to M$.
      A _vector field_ on $M$ is a continuous map $X : M \to T M$, written $p \mapsto X_p$, that assigns to each point $p$ a vector in the [tangent space](/dictionary/definitions/tangent-space) at $p$:

      $$X_p \in T_p M \quad \text{for all } p \in M.$$

      Equivalently, $X$ is a section of $\pi$, that is, $\pi \circ X = \operatorname{id}_M$.
properties:
  - >-
    A vector field $f$ on $\reals^n$ defines the differential equation $\dot{x} = f(x)$, whose solutions are curves whose velocity at each point $x$ is $f(x)$.
    The [flow](/dictionary/definitions/flow) of the vector field moves each point along these solutions.
  - >-
    A smooth vector field $X$ acts on smooth functions $h$ by differentiating them in the direction of $X$, $h \mapsto X h$, and this map is a [derivation](/dictionary/definitions/derivation).
    The number $X h$ at a point is the [Lie derivative](/dictionary/definitions/lie-derivative) of $h$ along $X$.
  - >-
    The [Lie bracket](/dictionary/definitions/lie-bracket) $[X, Y]$ of two smooth vector fields $X$ and $Y$ is again a vector field.
  - >-
    The [gradient](/dictionary/definitions/gradient) of a differentiable function $h : \reals^n \to \reals$ is a vector field.
    In $\reals^3$, the gradient of every twice continuously differentiable function has zero [curl](/dictionary/definitions/curl), so a vector field with nonzero curl, such as $(x, y, z) \mapsto (-y, x, 0)$, is not a gradient.
---
A vector field is different from a [field](/dictionary/definitions/field) in algebra, such as the real numbers, which is a set of numbers with addition and multiplication.

It is also different from a _scalar field_, in physics, which assigns a number to each point, such as the temperature at each point of a room.

In differential geometry, the coordinates of a vector field depend on the coordinate system: in a chart $(x^1, \dots, x^n)$, a vector field is written $X = X^i \frac{\partial}{\partial x^i}$, where the functions $X^i$ are its _component functions_.

A field of [covectors](/dictionary/definitions/covector) is a [differential form](/dictionary/definitions/differential-form) of degree $1$, not a vector field.
