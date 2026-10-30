---
published: false
title: Filippov solution
term: Filippov solution
applies_to: differential equations
levels:
  graduate:
    text: |-
      A _Filippov solution_ of $\dot{x} = f(x)$ is an [absolutely continuous](/definitions/absolutely-continuous) function $x(t)$ with $\dot{x}(t) \in F(x(t))$ for almost every $t$, where

      $$F(x) = \bigcap_{\delta > 0} \bigcap_{\mu(N) = 0} \overline{\operatorname{co}} f(B(x, \delta) \setminus N)$$

      is the closed convex hull of the values of $f$ near $x$, ignoring sets $N$ of [measure zero](/definitions/measure-zero).
properties:
  - >-
    Every Filippov solution is a [Krasovskii solution](/definitions/krasovskii-solution). If $f$ is [continuous](/definitions/continuous), Filippov solutions are exactly the [classical solutions](/definitions/classical-solution).
  - >-
    Filippov solutions exist whenever $f$ is measurable and locally [bounded](/definitions/bounded), which makes them the standard solution concept for discontinuous [feedback](/definitions/feedback), such as sliding mode control.
---
