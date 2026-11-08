---
published: false
title: Convex function
term: convex function
applies_to: real-valued functions
levels:
  high-school:
    text: |-
      Consider a function $f$ from an interval to $\reals$.
      The function $f$ is _convex_ if the segment between every two points on its graph lies on or above the graph.
  undergraduate:
    text: |-
      Consider a function $f : C \to \reals$ on a [convex set](/definitions/convex-set) $C$.
      The function $f$ is _convex_ if, for all $x, y \in C$ and every $\lambda \in [0, 1]$,

      $$f(\lambda x + (1 - \lambda) y) \leq \lambda f(x) + (1 - \lambda) f(y).$$
properties:
  - >-
    A twice-differentiable function of one variable is convex if and only if $f^{\prime\prime}(x) \geq 0$ for all $x$.
  - >-
    For a convex function, every local minimizer is a global [minimizer](/definitions/minimizer).
---
Older texts and some economics texts say "concave up" for convex.
