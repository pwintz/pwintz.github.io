---
published: false
title: "Lyapunov's direct method"
term: Lyapunov (direct)
applies_to: nonlinear systems
synonyms: ["Lyapunov's second method"]
levels:
  high-school:
    text: |-
      Consider a system with an [equilibrium](/dictionary/definitions/equilibrium), whose equations are too hard to solve.
      _Lyapunov's direct method_ shows that the system settles at the equilibrium by finding an energy-like quantity that always decreases along its solutions, without solving the equations.
  undergraduate:
    context: nonlinear systems
    text: |-
      Consider a nonlinear system $\dot{x} = f(x)$ with an [equilibrium](/dictionary/definitions/equilibrium).
      _Lyapunov's direct method_ shows that the equilibrium is [asymptotically stable](/dictionary/definitions/asymptotically-stable) by finding a [positive definite](/dictionary/definitions/positive-definite-function) function $V$ (a [Lyapunov function](/dictionary/definitions/lyapunov-function)) whose derivative $\dot{V} = \nabla V \cdot f$ along solutions is negative definite.
      It requires no solutions of the system.
---
