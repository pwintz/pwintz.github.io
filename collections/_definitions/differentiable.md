---
published: false
title: Differentiable function
term: differentiable
applies_to: functions
levels:
  high-school:
    text: |-
      A function $f$ is _differentiable_ at $a$ if the limit

      $$f^{\prime}(a) = \lim_{h \to 0} \frac{f(a + h) - f(a)}{h}$$

      exists. It is _differentiable_ if this holds at every point of its domain.
  undergraduate:
    context: functions on open subsets of $\reals^n$
    text: |-
      A function $f$ is _differentiable_ at $a$ if there is a [linear map](/definitions/linear-map) $Df(a)$ with

      $$\lim_{h \to 0} \frac{\lVert f(a + h) - f(a) - Df(a) h \rVert}{\lVert h \rVert} = 0.$$
properties:
  - >-
    Every differentiable function is [continuous](/definitions/continuous).
  - >-
    Having all [partial derivatives](/definitions/partial-derivative) at $a$ does not imply differentiability at $a$. If the partial derivatives exist near $a$ and are [continuous](/definitions/continuous) at $a$, then $f$ is differentiable at $a$.
---
