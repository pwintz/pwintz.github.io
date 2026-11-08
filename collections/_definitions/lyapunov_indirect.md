---
published: false
title: "Lyapunov's indirect method"
term: Lyapunov (indirect)
applies_to: nonlinear systems
synonyms: [linearization, "Lyapunov's first method"]
levels:
  high-school:
    text: |-
      Consider a system with an [equilibrium](/definitions/equilibrium), and a linear system that approximates it near the equilibrium.
      _Lyapunov's indirect method_ decides whether the equilibrium is stable by checking the linear system.
  undergraduate:
    context: nonlinear systems
    text: |-
      Consider a nonlinear system with an [equilibrium](/definitions/equilibrium), and the [Jacobian](/definitions/jacobian) of the system at the equilibrium (its linearization).
      _Lyapunov's indirect method_ checks the [eigenvalues](/definitions/eigenvalue) of the Jacobian.
      If every eigenvalue has negative real part, then the equilibrium is (locally) [exponentially stable](/definitions/exponentially-stable).
      If some eigenvalue has positive real part, then it is unstable.
      If neither holds, then the test is inconclusive.
---
