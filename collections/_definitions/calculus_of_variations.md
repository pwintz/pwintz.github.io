---
title: Calculus of variations
term: calculus of variations
applies_to: optimization problems
levels:
  high-school:
    text: |-
      _Calculus of variations_ is the study of finding the best curve or function among all possible curves or functions, where "best" is measured by a number computed from the whole curve, like the length of the curve or the time it takes to slide down the curve.
  undergraduate:
    context: analysis
    text: |-
      _Calculus of variations_ is the study of problems of finding a function $y : [a, b] \to \reals^n$, with fixed end values $y(a) = y_a$ and $y(b) = y_b$, that minimizes (or maximizes) a [functional](/dictionary/definitions/functional) of the form

      $$J[y] = \int_a^b L\bigl(t, y(t), y^{\prime}(t)\bigr) \, \mathrm{d}t.$$
properties:
  - >-
    If a [continuously differentiable](/dictionary/definitions/continuously-differentiable) function $y$ minimizes $J$, then $y$ satisfies the Euler–Lagrange equation $\frac{\mathrm{d}}{\mathrm{d}t} \frac{\partial L}{\partial y^{\prime}} = \frac{\partial L}{\partial y}$.
  - >-
    A problem in the calculus of variations is the [optimal control](/dictionary/definitions/optimal-control) problem with the dynamics $\dot{x} = u$ and no constraints on the input $u$, where the state $x$ plays the role of $y$.
---
The name comes from the _variation_ $\delta y$: a small change to the function $y$, which changes $J$ by approximately $\delta J$, much as a small change in $x$ changes $f(x)$ by approximately $f^{\prime}(x) \, \delta x$.
