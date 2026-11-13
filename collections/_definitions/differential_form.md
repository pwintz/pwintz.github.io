---
published: false
title: Differential form
term: differential form
applies_to: open sets and manifolds
synonyms: ['$k$-form']
levels:
  undergraduate:
    context: vector calculus
    text: |-
      Consider a natural number $k$ and an [open set](/dictionary/definitions/open-set) $U$ in $\reals^n$.
      A *differential $k$-form* on $U$ is a function $\omega$ that assigns to each point $x$ of $U$ an alternating multilinear function $\omega_x$ of $k$ vectors in $\reals^n$, such that $\omega_x$ depends continuously on $x$.
      In coordinates, every $k$-form can be written as

      $$\omega = \sum_{i_1 < \dots < i_k} f_{i_1 \cdots i_k}(x) \, \mathrm{d}x_{i_1} \wedge \dots \wedge \mathrm{d}x_{i_k}.$$
  graduate:
    context: differential geometry
    text: |-
      Consider a smooth manifold $M$ and a natural number $k$.
      A *differential $k$-form* on $M$ is a [continuous](/dictionary/definitions/continuous) [tensor](/dictionary/definitions/tensor) field on $M$ whose value at each point $p$ is an alternating $k$-tensor on the [tangent space](/dictionary/definitions/tangent-space) $T_p M$: a continuous section of the bundle $\Lambda^k T^{\ast} M$.
properties:
  - >-
    A $0$-form is a function, and a $1$-form is a field of [covectors](/dictionary/definitions/covector), such as the [differential](/dictionary/definitions/differential) $\mathrm{d}f$ of a function $f$.
  - >-
    A $k$-form can be integrated over an oriented $k$-dimensional surface (a curve for $k = 1$) without choosing coordinates.
  - >-
    The exterior derivative $\mathrm{d}$ maps $k$-forms to $(k + 1)$-forms and satisfies $\mathrm{d} \circ \mathrm{d} = 0$.
    On $\reals^3$, the exterior derivative combines the [gradient](/dictionary/definitions/gradient), the [curl](/dictionary/definitions/curl), and the [divergence](/dictionary/definitions/divergence).
---
"Alternating" means that the value changes sign whenever two of the $k$ vectors are swapped.
Most texts work with _smooth_ differential forms, whose coefficients $f_{i_1 \cdots i_k}$ are smooth functions.
