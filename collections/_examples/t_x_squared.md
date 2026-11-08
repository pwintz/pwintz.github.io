---
published: false
title: '$f(t, x) = t x^2$'
level: undergraduate
values:
  partial_derivative: '$\frac{\partial f}{\partial t} = x^2$ and $\frac{\partial f}{\partial x} = 2 t x$'
  differential: 'The linear map $\mathrm{d}f_{(t, x)} : (\Delta t, \Delta x) \mapsto x^2 \Delta t + 2 t x \Delta x$'
  total_derivative_linear_map: 'The linear map $Df(t, x) : (\Delta t, \Delta x) \mapsto x^2 \Delta t + 2 t x \Delta x$'
  ordinary_derivative: 'None'
why:
  ordinary_derivative: >-
    The function $f(t, x) = t x^2$ has no ordinary derivative, because it has two variables.
  differential: >-
    The differential of $f(t, x) = t x^2$ combines both partial derivatives into the linear approximation $Df(t, x)$.
  total_derivative: >-
    The total derivative of $f$ as a function of two variables is the linear map $Df(t, x)$ at each point.
    It takes a small change $(\Delta t, \Delta x)$ to the approximate change in $f$.
  partial_derivative: >-
    $f$ has two variables, so it has two partial derivatives, and no ordinary derivative.
---
