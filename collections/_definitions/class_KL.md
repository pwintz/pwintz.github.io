---
published: false
title: Class-KL function
term: "class-$\\mathcal{KL}$"
applies_to: scalar functions of two variables
levels:
  graduate:
    context: nonlinear control
    text: |-
      Consider a [continuous](/dictionary/definitions/continuous) function $\beta : [0, a) \times [0, \infty) \to [0, \infty)$ of two variables, $r$ and $s$.
      The function $\beta$ is of *class-$\mathcal{KL}$* if $r \mapsto \beta(r, s)$ is class-$\mathcal{K}$ for each $s$ and $s \mapsto \beta(r, s)$ is class-$\mathcal{L}$ for each $r$.
properties:
  - >-
    For $\dot{x} = f(x)$ with $f$ locally Lipschitz, the origin is [globally asymptotically stable](/dictionary/definitions/globally-asymptotically-stable) if and only if there is a class-$\mathcal{KL}$ function $\beta$ such that $\norm{x(t)} \leq \beta(\norm{x(0)}, t)$ for every solution and all $t \geq 0$.
---
