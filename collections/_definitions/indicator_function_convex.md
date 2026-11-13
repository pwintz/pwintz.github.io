---
published: false
title: Indicator function (convex analysis)
term: indicator function (convex analysis)
applies_to: sets
synonyms: ['$\delta_C$', '$\iota_C$']
levels:
  undergraduate:
    context: convex analysis and optimization
    text: |-
      Consider a set $C$ in $\reals^n$.
      In convex analysis, the _indicator function_ of $C$ is the function $\delta_C : \reals^n \to \reals \cup \setdef{\infty}$ defined by

      $$\delta_C(x) = \begin{cases} 0 & \text{if } x \in C, \\ \infty & \text{if } x \notin C. \end{cases}$$
properties:
  - >-
    For a function $f$ on $\reals^n$, minimizing $f + \delta_C$ over all of $\reals^n$ is the same as minimizing $f$ subject to $x \in C$.
    This turns a constrained problem into an unconstrained one.
  - >-
    The function $\delta_C$ is a [convex function](/dictionary/definitions/convex-function) if and only if $C$ is a [convex set](/dictionary/definitions/convex-set), and $\delta_C$ is lower semicontinuous if and only if $C$ is closed.
  - >-
    The convex indicator function is related to the 0–1 [indicator function](/dictionary/definitions/indicator-function) by $\delta_C = -\ln \mathbf{1}_C$, with the convention $-\ln 0 = \infty$.
---
Rockafellar writes $\delta_C$, and many optimization texts write $\iota_C$.
