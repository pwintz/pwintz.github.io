---
published: false
title: Output Strictly Passive System
term: output strictly passive
applies_to: input-output systems
levels:
  graduate:
    context: nonlinear control
    text: |-
      Consider a system with input $u$, output $y$, and a storage function $V$.
      The system is _output strictly passive_ if

      $$u\trans y \geq \dot{V} + y\trans \rho(y)$$

      for some function $\rho$ such that $y\trans \rho(y) > 0$ for all $y \neq 0$.
      If only $u\trans y \geq \dot{V} + y\trans \rho(y)$ holds, without the sign condition, then the system is _output-feedback passive_.
---
