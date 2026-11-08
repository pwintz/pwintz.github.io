---
title: Norm
term: norm
applies_to: vector spaces
synonyms: ['$\norm{x}$', length, magnitude]
levels:
  elementary:
    text: |-
      A [vector](/definitions/vector) is arrow between two points. Such a vector has a direction and a length. 
      The _norm_ of the vector is its length: how long the arrow is.
  high-school:
    text: |-
      Consider a [vector](/definitions/vector) $x = (x_1, \dots, x_n)$.
      The _norm_ of $x$ is its length: 
      
      $$\norm{x} = \sqrt{x_1^2 + \dots + x_n^2}.$$
    caveat: >-
      This is the [Euclidean norm](/definitions/euclidean-norm), which is only one of many norms.
      Others include $\abs{x_1} + \dots + \abs{x_n}$ and $\max_i \abs{x_i}$.
  undergraduate:
    text: |-
      Consider a [vector](/definitions/vector) space $V$ and a function $\norm{\cdot} : V \to [0, \infty)$.
      The function is a _norm_ on $V$ if 
      
      1. $\norm{x} = 0$ only for $x = 0$
      2. $\norm{c x} = \abs{c} \norm{x}$, and 
      3. $\norm{x + y} \leq \norm{x} + \norm{y}$ (the triangle inequality).
properties:
  - >-
    Every norm satisfies $\abs{\norm{x} - \norm{y}} \leq \norm{x - y}$, so it is a [continuous](/definitions/continuous) function.
  - >-
    On a finite-dimensional space, all norms are equivalent: they give the same [open sets](/definitions/open-set) and the same convergent [sequences](/definitions/sequence).
---
