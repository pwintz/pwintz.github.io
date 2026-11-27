---
published: false
title: Maximal Solution
term: maximal (solution)
applies_to: solutions of differential equations and hybrid systems
levels:
  undergraduate:
    context: ordinary differential equations
    text: |-
      Consider a [differential equation](/dictionary/definitions/differential-equation) $\dot{x} = f(x)$ on $\reals^n$, and a solution $x : I \to \reals^n$ of it, defined on an interval $I$ of times.
      The solution $x$ is _maximal_ if it cannot be extended: no other solution agrees with $x$ on $I$ and is defined on an interval strictly larger than $I$.
  graduate:
    context: hybrid systems
    text: |-
      Consider a solution of a [hybrid system](/dictionary/definitions/hybrid-system), defined on a hybrid time domain.
      The solution is _maximal_ if it cannot be extended: no other solution agrees with it on its hybrid time domain and has a strictly larger domain.
properties:
  - |-
    If $f$ is [continuous](/dictionary/definitions/continuous), every solution of $\dot{x} = f(x)$ extends to a maximal solution.
    If $f$ is also [locally Lipschitz](/dictionary/definitions/locally-lipschitz-continuous), each initial state has exactly one maximal solution.
  - |-
    If $f$ is [continuous](/dictionary/definitions/continuous) on all of $\reals^n$ and a maximal solution of $\dot{x} = f(x)$ is defined on an interval $I$ whose right end $b$ is finite, then the solution escapes to infinity in finite time: $\norm{x(t)} \to \infty$ as $t \to b$.
  - |-
    A maximal solution can fail to be complete by escaping to infinity in finite time, or by reaching a point from which it can neither flow nor jump.
---
