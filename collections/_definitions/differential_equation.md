---
published: false
title: Differential Equation
term: differential equation
applies_to: equations
levels:
  high-school:
    text: |-
      A _differential equation_ is an [equation](/dictionary/definitions/equation) that relates an unknown function to one or more derivatives of the function, such as $y^{\prime}(t) = 2 y(t)$.
      A _solution_ of a differential equation is a function that satisfies the equation at every point where the function is defined.
  undergraduate:
    text: |-
      Let $n$ be a positive [integer](/dictionary/definitions/integer), and let $F$ be a function of $n + 2$ variables.
      An _ordinary differential equation_ of _order_ $n$ for an unknown function $y$ of one variable $t$ is an equation of the form

      $$F\big(t, y(t), y^{\prime}(t), \dots, y^{(n)}(t)\big) = 0.$$

      A _solution_ of the equation on an interval $I$ is an $n$-times [differentiable](/dictionary/definitions/differentiable) function $y$ such that the equation holds for every $t \in I$.
properties:
  - |-
    A _partial differential equation_ relates an unknown function of two or more variables to the [partial derivatives](/dictionary/definitions/partial-derivative) of the function.
  - |-
    An ordinary differential equation of order $n$ is _linear_ if the equation has the form

    $$a_n(t) y^{(n)}(t) + \cdots + a_1(t) y^{\prime}(t) + a_0(t) y(t) = g(t).$$
  - |-
    An _initial value problem_ consists of a differential equation $y^{\prime}(t) = f(t, y(t))$ and an _initial condition_ $y(t_0) = y_0$.
  - |-
    If $f$ is [continuous](/dictionary/definitions/continuous) and $f$ is [locally Lipschitz continuous](/dictionary/definitions/locally-lipschitz-continuous) in $y$, then the initial value problem $y^{\prime}(t) = f(t, y(t))$, $y(t_0) = y_0$ has exactly one solution on some interval that contains $t_0$ (the Picard–Lindelöf theorem).
---
