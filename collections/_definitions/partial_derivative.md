---
title: Partial derivative
term: partial derivative
applies_to: functions of several variables
synonyms: ["$\\frac{\\partial f}{\\partial x_i}$"]
levels:
  high-school:
    text: |-
      Consider a function $f(x, y)$ of two variables.
      The _partial derivative_ of $f$ with respect to $x$ is the derivative of $f$ found by treating $y$ as a constant.
  undergraduate:
    text: |-
      Consider a function $f$ of several variables $x_1, \dots, x_n$.
      The _partial derivative_ $\frac{\partial f}{\partial x_i}$ is the derivative of $f$ with respect to $x_i$ while the other variables are held fixed:

    # TODO: Add formula: $$\frac{\partial f}{\partial x_i}() = \lim_{x \to $$
properties:
  - >-
    Having all partial derivatives at a point does not make a function [differentiable](/dictionary/definitions/differentiable) there, or even [continuous](/dictionary/definitions/continuous).
  - |-
    If the second partial derivatives are [continuous](/dictionary/definitions/continuous), then the order of differentiation does not matter:

    $$\frac{\partial^2 f}{\partial x \partial y} = \frac{\partial^2 f}{\partial y \partial x}$$

    (Schwarz's theorem).
---
