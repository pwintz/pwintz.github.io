---
published: false
title: Gradient
term: gradient
applies_to: scalar-valued functions
synonyms: [$\nabla f$]
levels:
  undergraduate:
    text: |-
      The _gradient_ of $f : \reals^n \to \reals$ is the [vector](/definitions/vector) of [partial derivatives](/definitions/partial-derivative) $\nabla f(x) = \left( \frac{\partial f}{\partial x_1}(x), \dots, \frac{\partial f}{\partial x_n}(x) \right)$.
  graduate:
    context: Riemannian manifolds
    text: |-
      The _gradient_ of $f$ at $x$ is the [vector](/definitions/vector) $\nabla f(x)$ such that $\langle \nabla f(x), v \rangle = \mathrm{d}f_x(v)$ for every tangent vector $v$.
properties:
  - >-
    If $\nabla f(x) \neq 0$, it points in the direction of steepest increase of $f$, and its length is the rate of increase in that direction.
  - >-
    The gradient is perpendicular to the level sets of $f$.
  - >-
    The gradient depends on the choice of [inner product](/definitions/inner-product) (Riemannian metric); the [differential](/definitions/differential) $\mathrm{d}f$ does not.
---
