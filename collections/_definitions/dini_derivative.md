---
published: false
title: Dini derivative
term: Dini derivative
applies_to: functions of one variable
synonyms: ["$D^{+} f$"]
levels:
  graduate:
    text: |-
      Consider a function $f$ of a real variable $t$, which may not be [differentiable](/definitions/differentiable).
      The upper right _Dini derivative_ of $f$ at $t$ is

      $$D^{+} f(t) = \limsup_{h \to 0^{+}} \frac{f(t + h) - f(t)}{h}.$$

      The other three Dini derivatives replace $\limsup$ with $\liminf$, or $h \to 0^{+}$ with $h \to 0^{-}$.
properties:
  - >-
    Every real-valued function has all four Dini derivatives, possibly equal to $\pm \infty$, even where it has no derivative.
  - >-
    If $f$ is [continuous](/definitions/continuous) and $D^{+} f(t) \leq 0$ for all $t$, then $f$ is nonincreasing.
    This extends Lyapunov arguments to [Lyapunov functions](/definitions/lyapunov-function) that are not [differentiable](/definitions/differentiable), using $D^{+} V(x(t))$ in place of $\dot{V}$.
---
