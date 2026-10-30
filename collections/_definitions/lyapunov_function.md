---
published: false
title: Lyapunov function
term: Lyapunov function
applies_to: equilibria
levels:
  elementary:
    text: |-
      A _Lyapunov function_ is a measure, like energy, that keeps going down as a system moves, until the system comes to rest.
  high-school:
    text: |-
      A _Lyapunov function_ is an energy-like quantity that is smallest at an [equilibrium](/definitions/equilibrium) and never increases as the system evolves, which shows that solutions cannot wander far from the equilibrium.
  undergraduate:
    text: |-
      A _Lyapunov function_ for the [equilibrium](/definitions/equilibrium) $x = 0$ of $\dot{x} = f(x)$ is a [continuously differentiable](/definitions/continuously-differentiable), [positive definite](/definitions/positive-definite-function) function $V$ whose derivative along solutions, $\dot{V}(x) = \nabla V(x) \cdot f(x)$, satisfies $\dot{V}(x) \leq 0$ near $0$.
properties:
  - >-
    If a Lyapunov function exists, the [equilibrium](/definitions/equilibrium) is stable. If $\dot{V}$ is negative definite, it is [asymptotically stable](/definitions/asymptotically-stable). If, in addition, $V$ is radially unbounded and $\dot{V}(x) < 0$ for all $x \neq 0$, it is [globally asymptotically stable](/definitions/globally-asymptotically-stable).
  - >-
    Converse Lyapunov theorems: every [asymptotically stable](/definitions/asymptotically-stable) [equilibrium](/definitions/equilibrium) of a system with a locally Lipschitz $f$ has a Lyapunov function with $\dot{V}$ negative definite.
  - >-
    Each sublevel set $\lbrace x : V(x) \leq c \rbrace$ of a Lyapunov function (within the region where $\dot{V} \leq 0$) is [forward invariant](/definitions/forward-invariant).
---
Conventions vary on whether $\dot{V}$ must be negative semidefinite or negative definite. Some authors call the latter a _strict_ Lyapunov function.
