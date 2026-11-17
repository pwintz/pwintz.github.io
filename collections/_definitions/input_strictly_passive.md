---
published: false
title: Input Strictly Passive System
term: input strictly passive
applies_to: input-output systems
levels:
  graduate:
    context: nonlinear control
    text: |-
      Consider a system with input $u$, output $y$, and a storage function $V$.
      The system is _input strictly passive_ if

      $$u\trans y \geq \dot{V} + u\trans \varphi(u)$$

      for some function $\varphi$ such that $u\trans \varphi(u) > 0$ for all $u \neq 0$.
      If only $u\trans y \geq \dot{V} + u\trans \varphi(u)$ holds, without the sign condition, then the system is _input-feedforward passive_.
---
