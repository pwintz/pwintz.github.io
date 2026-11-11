---
published: false
title: Set-valued map
term: set-valued map
applies_to: functions
synonyms: [multifunction, correspondence, set-valued function, multivalued map, '$F : X \rightrightarrows Y$']
levels:
  undergraduate:
    text: |-
      Consider sets $X$ and $Y$.
      A _set-valued map_ $F$ from $X$ to $Y$, written $F : X \rightrightarrows Y$, assigns to each point $x \in X$ a [subset](/dictionary/definitions/subset) $F(x)$ of $Y$, which may be empty or contain many points.
properties:
  - >-
    The _graph_ of $F$ is the set
  
    $$\operatorname{gph} F = \setdef{(x, y) \in X \times Y \suchthat y \in F(x)}.$$
  
    A set-valued map is determined by its graph, and every [subset](/dictionary/definitions/subset) of $X \times Y$ is the graph of a set-valued map.
  - >-
    A function $f : X \to Y$ gives the set-valued map $x \mapsto \setdef{f(x)}$.
    The inverse $f^{-1}(y) = \setdef{x \suchthat f(x) = y}$ of every function is a set-valued map, even when $f$ has no inverse function.
  - >-
    Differential inclusions $\dot{x} \in F(x)$, such as the [Filippov](/dictionary/definitions/filippov-solution) regularization of a discontinuous differential equation, use set-valued maps.
---
