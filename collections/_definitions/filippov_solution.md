---
published: false
title: Filippov solution
term: Filippov solution
applies_to: differential equations
levels:
  graduate:
    text: |-
      Consider a differential equation $\dot{x} = f(x)$ whose right-hand side may be discontinuous, and replace $f$ by the [set-valued map](/dictionary/definitions/set-valued-map)

      $$F(x) = \bigcap_{\delta > 0} \bigcap_{\mu(N) = 0} \overline{\operatorname{co}} f(B(x, \delta) \setminus N),$$

      the closed convex hull of the values of $f$ near $x$, ignoring sets $N$ of [measure zero](/dictionary/definitions/measure-zero).
      A _Filippov solution_ of $\dot{x} = f(x)$ is an [absolutely continuous](/dictionary/definitions/absolutely-continuous) function $x(t)$ such that $\dot{x}(t) \in F(x(t))$ for almost every $t$.
properties:
  - >-
    Every Filippov solution is a [Krasovskii solution](/dictionary/definitions/krasovskii-solution).
    If $f$ is [continuous](/dictionary/definitions/continuous), then Filippov solutions are exactly the [classical solutions](/dictionary/definitions/classical-solution).
  - >-
    Filippov solutions exist whenever $f$ is measurable and locally [bounded](/dictionary/definitions/bounded), which makes them the standard solution concept for discontinuous [feedback](/dictionary/definitions/feedback), such as sliding mode control.
---
