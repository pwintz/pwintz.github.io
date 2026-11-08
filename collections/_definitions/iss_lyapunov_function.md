---
published: false
title: ISS-Lyapunov function
term: ISS-Lyapunov function
applies_to: systems with inputs
levels:
  graduate:
    text: |-
      Consider a system $\dot{x} = f(x, d)$ with state $x$ and input $d$.
      An _ISS-Lyapunov function_ for the system is a [continuously differentiable](/definitions/continuously-differentiable) function $V$ with

      $$\alpha_1(\norm{x}) \leq V(x) \leq \alpha_2(\norm{x})$$

      and

      $$\nabla V(x) \cdot f(x, d) \leq -\alpha_3(\norm{x}) + \sigma(\norm{d})$$

      for all $x$ and $d$, where $\alpha_1$, $\alpha_2$, and $\alpha_3$ are class-$$\mathcal{K}_\infty$$ functions and $\sigma$ is a class-$\mathcal{K}$ function.
properties:
  - >-
    A system is [input-to-state stable](/definitions/input-to-state-stable) if and only if it has an ISS-Lyapunov function (Sontag and Wang).
---
