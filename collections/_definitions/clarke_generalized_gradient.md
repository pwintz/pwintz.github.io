---
published: false
title: Clarke generalized gradient
term: Clarke generalized gradient
applies_to: locally Lipschitz functions
synonyms: [Clarke subdifferential, $\partial f(x)$]
levels:
  graduate:
    text: |-
      For a locally Lipschitz function $f : \reals^n \to \reals$, the _Clarke generalized gradient_ at $x$ is $\partial f(x) = \overline{\operatorname{co}} \lbrace \lim_{k \to \infty} \nabla f(x_k) : x_k \to x, x_k \notin \Omega \rbrace$: the convex hull of all limits of [gradients](/definitions/gradient) at nearby points, where $\Omega$ is any set of [measure zero](/definitions/measure-zero) that contains the points where $f$ is not [differentiable](/definitions/differentiable).
properties:
  - >-
    If $f$ is [continuously differentiable](/definitions/continuously-differentiable), $\partial f(x) = \lbrace \nabla f(x) \rbrace$. If $f$ is convex, $\partial f(x)$ is the [subdifferential](/definitions/subdifferential).
  - >-
    For $f(x) = \lvert x \rvert$, $\partial f(0) = [-1, 1]$.
  - >-
    If $x$ is a local [minimizer](/definitions/minimizer) of $f$, then $0 \in \partial f(x)$.
---
