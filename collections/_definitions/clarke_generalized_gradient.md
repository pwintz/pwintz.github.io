---
published: false
title: Clarke generalized gradient
term: Clarke generalized gradient
applies_to: locally Lipschitz functions
synonyms: [Clarke subdifferential, $\partial f(x)$]
levels:
  graduate:
    text: |-
      Consider a locally Lipschitz function $f : \reals^n \to \reals$, and let $\Omega$ be any set of [measure zero](/definitions/measure-zero) that contains the points where $f$ is not [differentiable](/definitions/differentiable).
      The _Clarke generalized gradient_ of $f$ at $x$ is

      $$\partial f(x) = \overline{\operatorname{co}} \setdef{\lim_{k \to \infty} \nabla f(x_k) \suchthat x_k \to x, x_k \notin \Omega}:$$

      the convex hull of all limits of [gradients](/definitions/gradient) at nearby points.
properties:
  - >-
    If $f$ is [continuously differentiable](/definitions/continuously-differentiable), $\partial f(x) = \setdef{\nabla f(x)}$.
    If $f$ is convex, $\partial f(x)$ is the [subdifferential](/definitions/subdifferential).
  - >-
    For $f(x) = \abs{x}$, $\partial f(0) = [-1, 1]$.
  - >-
    If $x$ is a local [minimizer](/definitions/minimizer) of $f$, then $0 \in \partial f(x)$.
---
