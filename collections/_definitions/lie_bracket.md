---
title: Lie bracket
term: Lie bracket
applies_to: vector fields and Lie algebras
synonyms: ['$[f, g]$']
levels:
  undergraduate:
    context: vector fields on ℝⁿ
    text: |-
      Consider two [continuously differentiable](/dictionary/definitions/continuously-differentiable) [vector fields](/dictionary/definitions/vector-field) $f$ and $g$ on $\reals^n$, with [Jacobian](/dictionary/definitions/jacobian) matrices $\frac{\partial f}{\partial x}$ and $\frac{\partial g}{\partial x}$.
      The _Lie bracket_ of $f$ and $g$ is the vector field $[f, g]$ defined by

      $$[f, g](x) = \frac{\partial g}{\partial x}(x) \, f(x) - \frac{\partial f}{\partial x}(x) \, g(x).$$
  graduate:
    context: Lie algebras
    text: |-
      A _Lie bracket_ on a [vector space](/dictionary/definitions/vector-space) $V$ is a bilinear map $[\cdot, \cdot] : V \times V \to V$ such that, for all $x, y, z \in V$,

      1. $[x, y] = -[y, x]$, and
      2. $\big[x,~[y, z]\big] + \big[y,~[z, x]\big] + \big[z,~[x, y]\big] = 0$ (the Jacobi identity).

      A vector space with a Lie bracket is called a _Lie algebra_.
properties:
  - >-
    On a manifold, the _Lie bracket_ of smooth [vector fields](/dictionary/definitions/vector-field) $X$ and $Y$, viewed as [derivations](/dictionary/definitions/derivation) of the smooth functions, is $[X, Y] f = X (Y f) - Y (X f)$.
    On $\reals^n$, this agrees with the formula $[f, g] = \frac{\partial g}{\partial x} f - \frac{\partial f}{\partial x} g$.
  - >-
    The Lie bracket $[X, Y]$ is the [Lie derivative](/dictionary/definitions/lie-derivative) of $Y$ along $X$.
  - |-
    The Lie bracket measures how much two [flows](/dictionary/definitions/flow) fail to commute: moving along $f$, then $g$, then $-f$, then $-g$, each for time $t$, moves a point $x$ to 
    
    $$x + t^2 [f, g](x) + O(t^3).$$

    This is why Lie brackets are useful for determing which directions a nonlinear control system can move in.
---
Sign conventions differ.
Some texts define the Lie bracket of [vector fields](/dictionary/definitions/vector-field) with the opposite sign, $\frac{\partial f}{\partial x} g - \frac{\partial g}{\partial x} f$.
For matrices, the Lie bracket is the commutator $[A, B] = A B - B A$, but for the linear vector fields $f(x) = A x$ and $g(x) = B x$, the formula above gives ${[f, g]}(x) = (B A - A B) x$, with the opposite order.
