---
published: false
title: Jump discontinuity
term: jump discontinuity
applies_to: functions
levels:
  high-school:
    text: |-
      Consider a function $f$ and a point $a$.
      The function $f$ has a _jump discontinuity_ at $a$ if the graph of $f$ approaches one height from the left of $a$ and a different height from the right of $a$, so the graph jumps at $a$.
  undergraduate:
    text: |-
      Consider a function $f$ defined near a point $a$.
      The function $f$ has a _jump discontinuity_ at $a$ if the [left limit](/dictionary/definitions/left-limit) and the [right limit](/dictionary/definitions/right-limit) at $a$ both exist and

      $$\lim_{x \to a^{-}} f(x) \neq \lim_{x \to a^{+}} f(x).$$
properties:
  - >-
    No choice of $f(a)$ makes $f$ [continuous](/dictionary/definitions/continuous) at a jump discontinuity.
  - >-
    A derivative has no jump discontinuities, by Darboux's theorem, and a monotone function has no discontinuities other than jump discontinuities.
---
