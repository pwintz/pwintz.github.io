---
published: false
title: Dini derivative
term: Dini derivative
applies_to: functions of one variable
synonyms: ["$D^{+} f$"]
levels:
  graduate:
    text: |-
      The upper right _Dini derivative_ of $f$ at $t$ is

      $$D^{+} f(t) = \limsup_{h \to 0^{+}} \frac{f(t + h) - f(t)}{h}.$$

      The other three Dini derivatives replace $\limsup$ with $\liminf$, or $h \to 0^{+}$ with $h \to 0^{-}$.
properties:
  - >-
    Dini derivatives always exist, possibly as $\pm \infty$, even when the derivative does not.
  - >-
    If $f$ is [continuous](/definitions/continuous) and $D^{+} f(t) \leq 0$ for all $t$, then $f$ is nonincreasing. This extends Lyapunov arguments to [Lyapunov functions](/definitions/lyapunov-function) that are not [differentiable](/definitions/differentiable), using $D^{+} V(x(t))$ in place of $\dot{V}$.
---
