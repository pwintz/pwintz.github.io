---
title: Gradient
term: gradient
applies_to: scalar-valued functions
synonyms: [$\nabla f$]
levels:
  undergraduate:
    text: |-
      Consider a [differentiable](/dictionary/definitions/differentiable) function $f : \reals^n \to \reals$.
      The _gradient_ of $f$ is the [vector](/dictionary/definitions/vector) of [partial derivatives](/dictionary/definitions/partial-derivative)

      $$\nabla f(x) = \left( \frac{\partial f}{\partial x_1}(x), \dots, \frac{\partial f}{\partial x_n}(x) \right).$$
  graduate:
    context: Riemannian manifolds
    text: |-
      Consider a smooth function $f$ on a Riemannian manifold, with [inner product](/dictionary/definitions/inner-product) $\ip{\cdot}{\cdot}$ on each [tangent space](/dictionary/definitions/tangent-space).
      The _gradient_ of $f$ at $x$ is the [vector](/dictionary/definitions/vector) $\nabla f(x)$ such that

      $$\ip{\nabla f(x)}{v} = \mathrm{d}f_x(v) \quad \text{for every tangent vector } v.$$
properties:
  - >-
    If $\nabla f(x) \neq 0$, then it points in the direction of steepest increase of $f$, and its length is the rate of increase in that direction.
  - >-
    The gradient is perpendicular to the level sets of $f$.
  - >-
    The gradient depends on the choice of [inner product](/dictionary/definitions/inner-product) (Riemannian [metric](/dictionary/definitions/metric)); the [differential](/dictionary/definitions/differential) $\mathrm{d}f$ does not.
---
