---
published: false
title: Level Set
term: level set
applies_to: functions
synonyms: [level curve, level surface, contour line, zero level set]
levels:
  high-school:
    text: |-
      Consider a function $f$ of two variables $x$ and $y$, such as the height of the land at each point of a map, and a number $c$.
      The _level set_ of $f$ at $c$ is the set of points $(x, y)$ such that $f(x, y) = c$.
      For example, the contour lines on a topographic map are level sets of the height.
  undergraduate:
    text: |-
      Consider a function $f : X \to \reals$ and a number $c \in \reals$.
      The _$c$-level set_ of $f$ is the [preimage](/dictionary/definitions/preimage) of $\setdef{c}$:

      $$f^{-1}(\setdef{c}) = \setdef{x \in X \suchthat f(x) = c}.$$
  graduate:
    text: |-
      Consider a map $F : M \to N$ between sets $M$ and $N$, and a point $c \in N$.
      The _level set_ of $F$ at $c$ is the [preimage](/dictionary/definitions/preimage)

      $$F^{-1}(\setdef{c}) = \setdef{x \in M \suchthat F(x) = c}.$$
properties:
  - >-
    The level sets of $f$ partition the domain $X$: each $x \in X$ is in exactly one level set, the level set at $c = f(x)$.
  - >-
    If $f$ is [continuous](/dictionary/definitions/continuous), then each level set of $f$ is a [closed set](/dictionary/definitions/closed-set), because $\setdef{c}$ is closed.
  - >-
    If $f : \reals^n \to \reals$ is [continuously differentiable](/dictionary/definitions/continuously-differentiable) and $\nabla f(x) \neq 0$, then the [gradient](/dictionary/definitions/gradient) $\nabla f(x)$ is [perpendicular](/dictionary/definitions/perpendicular) to the level set of $f$ through $x$.
  - >-
    For $f : \reals^2 \to \reals$, the level sets are usually curves, called _level curves_.
    For $f : \reals^3 \to \reals$, the level sets are usually surfaces, called _level surfaces_.
  - >-
    A level set at a regular value of a smooth map $F : M \to N$ between smooth [manifolds](/dictionary/definitions/manifold) is an embedded submanifold of $M$ whose codimension equals the dimension of $N$ (the regular level set theorem).
---
