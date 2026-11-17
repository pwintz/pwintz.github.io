---
published: false
title: Sublevel Set
term: sublevel set
applies_to: real-valued functions
synonyms: [lower level set, zero sublevel set]
levels:
  high-school:
    text: |-
      Consider a function $f$ of two variables $x$ and $y$, such as the height of the land at each point of a map, and a number $c$.
      The _sublevel set_ of $f$ at $c$ is the set of points $(x, y)$ such that $f(x, y) \leq c$.
      For example, if the height is measured in meters, then the sublevel set at $100$ is the land that would be under water if the sea rose to $100$ meters.
  undergraduate:
    text: |-
      Consider a function $f : X \to \reals$ and a number $c \in \reals$.
      The _$c$-sublevel set_ of $f$ is the [preimage](/dictionary/definitions/preimage) of $(-\infty, c]$:

      $$f^{-1}((-\infty, c]) = \setdef{x \in X \suchthat f(x) \leq c}.$$
properties:
  - |-
    The $0$-sublevel set, called the _zero sublevel set_,

    $$\setdef{x \in X \suchthat f(x) \leq 0},$$

    is the most common sublevel set, because each inequality $g(x) \leq c$ can be rewritten as $g(x) - c \leq 0$.
    For example, the feasible set of the constraint $g(x) \leq 0$ in an optimization problem is the zero sublevel set of $g$, and the initial set of a [barrier certificate](/dictionary/definitions/barrier-certificate) $B$ is contained in the zero sublevel set of $B$.
  - >-
    The sublevel sets of $f$ are nested: if $c_1 \leq c_2$, then the $c_1$-sublevel set is a [subset](/dictionary/definitions/subset) of the $c_2$-sublevel set.
  - >-
    The $c$-[level set](/dictionary/definitions/level-set) of $f$ is a [subset](/dictionary/definitions/subset) of the $c$-sublevel set of $f$.
    If $f$ is [continuous](/dictionary/definitions/continuous), then the [boundary](/dictionary/definitions/boundary) of the $c$-sublevel set is a subset of the $c$-level set, but the two sets can differ: for the constant function $f(x) = 0$, the $0$-sublevel set is all of $X$, which has an empty boundary in $X$.
  - >-
    If $f$ is [continuous](/dictionary/definitions/continuous), then each sublevel set of $f$ is a [closed set](/dictionary/definitions/closed-set), because $(-\infty, c]$ is closed.
  - >-
    If $f$ is a [convex function](/dictionary/definitions/convex-function), then each sublevel set of $f$ is a [convex set](/dictionary/definitions/convex-set).
    The converse is false: a function whose sublevel sets are all convex is called _quasiconvex_.
  - >-
    If $V : \reals^n \to \reals$ is a [Lyapunov function](/dictionary/definitions/lyapunov-function) for $\dot{x} = f(x)$ and $\dot{V}(x) \leq 0$ for every $x \in \reals^n$, then each sublevel set of $V$ is [forward invariant](/dictionary/definitions/forward-invariant), because $V$ does not increase along solutions.
  - >-
    The _strict sublevel set_ is $\setdef{x \in X \suchthat f(x) < c}$, and the _superlevel set_ is $\setdef{x \in X \suchthat f(x) \geq c}$.
    The superlevel set of $f$ at $c$ is the sublevel set of $-f$ at $-c$.
---
