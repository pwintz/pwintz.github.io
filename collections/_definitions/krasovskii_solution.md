---
published: false
title: Krasovskii solution
term: Krasovskii solution
applies_to: differential equations
levels:
  graduate:
    text: |-
      Consider a differential equation $\dot{x} = f(x)$ whose right-hand side may be discontinuous, and replace $f$ by the [set-valued map](/definitions/set-valued-map)

      $$K(x) = \bigcap_{\delta > 0} \overline{\operatorname{co}} f(B(x, \delta)),$$

      the closed convex hull of all values of $f$ near $x$.
      A _Krasovskii solution_ of $\dot{x} = f(x)$ is an [absolutely continuous](/definitions/absolutely-continuous) function $x(t)$ such that $\dot{x}(t) \in K(x(t))$ for almost every $t$.
properties:
  - >-
    For locally [bounded](/definitions/bounded) $f$, the Krasovskii solutions are exactly the [Hermes solutions](/definitions/hermes-solution): the limits of solutions under vanishing measurement errors (Hájek).
  - >-
    Krasovskii solutions do not ignore sets of [measure zero](/definitions/measure-zero), so changing $f$ on a set of measure zero can create Krasovskii solutions but cannot change the [Filippov solutions](/definitions/filippov-solution).
---
