---
published: false
title: Hermes solution
term: Hermes solution
applies_to: differential equations
levels:
  graduate:
    text: |-
      Consider a differential equation $\dot{x} = f(x)$ whose right-hand side may be discontinuous, and perturbed versions of it, $\dot x_k = f(x_k + e_k(t))$, where $e_k$ is a [sequence](/definitions/sequence) of measurable perturbations with $\sup_t \lvert e_k(t) \rvert \to 0$.
      A _Hermes solution_ of $\dot{x} = f(x)$ is a function $x(t)$ that is the uniform limit of [Carathéodory solutions](/definitions/caratheodory-solution) $x_k(t)$ of the perturbed equations.
properties:
  - >-
    Hermes solutions describe the behavior that survives arbitrarily small measurement errors, such as when $f(x) = f_0(x, k(x))$ comes from a discontinuous [feedback](/definitions/feedback) law $k$ evaluated at a noisy measurement of $x$.
  - >-
    For locally [bounded](/definitions/bounded) $f$, the Hermes solutions are exactly the [Krasovskii solutions](/definitions/krasovskii-solution) (Hájek).
---
Hermes solutions are named after Henry Hermes, who introduced them in 1967.
