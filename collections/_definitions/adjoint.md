---
title: Adjoint of a linear map
term: adjoint
applies_to: linear maps between inner product spaces
synonyms: [adjoint operator, '$T^{\ast}$']
levels:
  undergraduate:
    text: |-
      Consider finite-dimensional [inner product spaces](/dictionary/definitions/inner-product-space) $V$ and $W$ and a [linear map](/dictionary/definitions/linear-map) $T : V \to W$.
      The _adjoint_ of $T$ is the linear map $T^{\ast} : W \to V$ such that

      $$\ip{T v}{w} = \ip{v}{T^{\ast} w} \quad \text{for all } v \in V \text{ and } w \in W.$$
  graduate:
    context: functional analysis
    text: |-
      Consider [Hilbert spaces](/dictionary/definitions/hilbert-space) $H$ and $K$ and a bounded [linear operator](/dictionary/definitions/linear-map) $T : H \to K$.
      The _adjoint_ of $T$ is the bounded linear operator $T^{\ast} : K \to H$ such that

      $$\ip{T x}{y} = \ip{x}{T^{\ast} y} \quad \text{for all } x \in H \text{ and } y \in K.$$
properties:
  - >-
    The adjoint depends on the [inner products](/dictionary/definitions/inner-product), not only on the map.
    For example, see [the adjoint of $x \mapsto A x$ with a weighted inner product](/dictionary/examples/linear-map-with-weighted-inner-product).
  - >-
    Relative to [orthonormal](/dictionary/definitions/orthonormal) bases of $V$ and $W$, the matrix of $T^{\ast}$ is the [conjugate transpose](/dictionary/definitions/conjugate-transpose) of the matrix of $T$.
  - >-
    $(S T)^{\ast} = T^{\ast} S^{\ast}$, and $(T^{\ast})^{\ast} = T$.
  - >-
    A [linear map](/dictionary/definitions/linear-map) $T : V \to V$ such that $T^{\ast} = T$ is called _self-adjoint_.
---
### Adjoints of unbounded operators

The graduate definition applies only to bounded operators, but differential [operators](/dictionary/definitions/operator) are not bounded.
For example, consider the derivative $D f = f^{\prime}$ on functions on $[0, 1]$, with the inner product $\ip{f}{g} = \int_0^1 f g \, \mathrm{d}x$.
The functions $f_n(x) = \sin(n \pi x)$ all have the norm $\norm{f_n} = 1/\sqrt{2}$, but their derivatives $D f_n(x) = n \pi \cos(n \pi x)$ have the norms $\norm{D f_n} = n \pi / \sqrt{2}$, which grow without bound as $n$ increases.
So no constant $c$ satisfies $\norm{D f} \leq c \norm{f}$ for every $f$, and $D$ is not bounded.

The derivative $D$ is also defined only on some functions, such as the differentiable functions that satisfy given boundary conditions.
The set of functions on which $D$ is defined is called the _domain_ of $D$, written $\dom D$.
Restricting the domain does not make $D$ bounded, because every $f_n$ satisfies the boundary conditions $f_n(0) = f_n(1) = 0$.
Instead, the definition of the adjoint is extended to unbounded operators: when $\dom D$ is dense, as it is here, the adjoint $D^{\ast}$ is defined by the same equation,

$$\ip{D f}{g} = \ip{f}{D^{\ast} g} \quad \text{for all } f \in \dom D,$$

but $\dom D^{\ast}$ contains only the functions $g$ for which some function $D^{\ast} g$ satisfies this equation.
So the boundary conditions in $\dom D$ determine $\dom D^{\ast}$, because the boundary conditions decide which boundary terms vanish in integration by parts:

$$\int_0^1 f^{\prime} g \, \mathrm{d}x = f(1) g(1) - f(0) g(0) - \int_0^1 f g^{\prime} \, \mathrm{d}x.$$

If $\dom D$ requires $f(0) = f(1) = 0$, then $D^{\ast} g = -g^{\prime}$ for all differentiable $g$.
If $\dom D$ has no boundary conditions, then $D^{\ast} g = -g^{\prime}$ only for the differentiable $g$ such that $g(0) = g(1) = 0$.

### Other meanings of "adjoint"

"Adjoint" has an unrelated meaning for matrices: the _adjugate_ (or _classical adjoint_) $\operatorname{adj} A$ is the transpose of the matrix of [cofactors](/dictionary/definitions/cofactor) of $A$, which satisfies $A \operatorname{adj} A = (\det A) I$.
The _dual map_ $T^{\top} : W^{\ast} \to V^{\ast}$, defined by $(T^{\top} \omega)(v) = \omega(T v)$ for [covectors](/dictionary/definitions/covector) $\omega$, is also sometimes written $T^{\ast}$, but the dual map needs no [inner products](/dictionary/definitions/inner-product).
