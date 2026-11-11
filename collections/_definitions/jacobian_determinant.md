---
title: Jacobian determinant
term: Jacobian determinant
applies_to: functions with as many outputs as inputs
synonyms: [Jacobian, '$\det Df(x)$', '$\frac{\partial(y_1, \dots, y_n)}{\partial(x_1, \dots, x_n)}$']
levels:
  high-school:
    text: |-
      Consider a function $f(x, y)$ that maps each point of the $xy$-plane to a new point in the plane. Near a given point, $f$ stretches or shrinks tiny regions, and it may also flip them over, like a mirror. The _Jacobian determinant_ of $f$ at that point is the factor by which $f$ scales the areas of those tiny regions, made negative if $f$ flips them over.
  undergraduate:
    text: |-
      Consider a [differentiable](/dictionary/definitions/differentiable) function $f : \reals^n \to \reals^n$ (which has as the same number of outputs as inputs, so its [Jacobian](/dictionary/definitions/jacobian) [matrix](/dictionary/definitions/matrix) $Df(x)$ at each point $x$ is square). The _Jacobian determinant_ of $f$ at $x$ is the [determinant](/dictionary/definitions/determinant) of that matrix, $\det Df(x)$.
properties:
  - |-
    Change of variables: if $f$ is a one-to-one, [continuously differentiable](/dictionary/definitions/continuously-differentiable) map from a region $U$ onto a region $V$, then
    
    $$\int_V g(y) \mathrm{d}y = \int_U g(f(x)) \abs{\det Df(x)} \mathrm{d}x.$$
  - |-
    Inverse function theorem: if $\det Df(x) \neq 0$ and $f$ is [continuously differentiable](/dictionary/definitions/continuously-differentiable), then $f$ has a continuously differentiable inverse near $x$.
  - |-
    The Jacobian determinant of a composition is the product of the Jacobian determinants: $\det D(g \circ f)(x) = \det Dg(f(x)) \cdot \det Df(x)$.
---
It is often called simply "the Jacobian," which can also mean the [Jacobian matrix](/dictionary/definitions/jacobian). See [Jacobian: matrix vs. determinant](/dictionary/distinctions/meanings-of-jacobian).
