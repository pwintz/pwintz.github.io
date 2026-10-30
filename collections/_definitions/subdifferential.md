---
published: false
title: Subdifferential
term: subdifferential
applies_to: convex functions
synonyms: [set of subgradients]
levels:
  undergraduate:
    context: convex functions
    text: |- # TODO: Move subgradient into a separate definition.
      For a convex function $f$, a [vector](/definitions/vector) $g$ is a _subgradient_ at $x$ if $f(y) \geq f(x) + g \cdot (y - x)$ for all $y$, so the plane through $(x, f(x))$ with slope $g$ lies below the graph of $f$. The _subdifferential_ $\partial f(x)$ is the set of all subgradients at $x$.
properties:
  - >-
    A point $x$ minimizes a convex function $f$ if and only if $0 \in \partial f(x)$.
  - >-
    If a convex function $f$ is [differentiable](/definitions/differentiable) at $x$, then $\partial f(x) = \lbrace \nabla f(x) \rbrace$.
---
