---
published: false
title: Fréchet derivative
term: Fréchet derivative
applies_to: maps between normed spaces
levels:
  undergraduate:
    context: functions on $\reals^n$
    text: |-
      Consider a function $f : \reals^n \to \reals^m$ and a point $x$.
      The _Fréchet derivative_ of $f$ at $x$ is the [linear map](/dictionary/definitions/linear-map) $Df(x)$ with

      $$\lim_{h \to 0} \frac{\norm{f(x + h) - f(x) - Df(x) h}}{\norm{h}} = 0,$$

      if it exists.
      This is the usual derivative of multivariable calculus.
  graduate:
    context: normed spaces
    text: |-
      Consider a map $f : X \to Y$ between [normed spaces](/dictionary/definitions/normed-space) and a point $x$.
      The map $f$ is Fréchet [differentiable](/dictionary/definitions/differentiable) at $x$ if there is a [bounded](/dictionary/definitions/bounded) [linear map](/dictionary/definitions/linear-map) $Df(x) : X \to Y$ such that $\norm{f(x + h) - f(x) - Df(x) h} = o(\norm{h})$ as $h \to 0$.
      The map $Df(x)$ is the _Fréchet derivative_ of $f$ at $x$.
properties:
  - >-
    If $f$ is Fréchet [differentiable](/dictionary/definitions/differentiable) at $x$, then it is [continuous](/dictionary/definitions/continuous) at $x$ and Gâteaux differentiable at $x$, with the same derivative.
---
