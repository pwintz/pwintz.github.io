---
title: Linear map
term: linear map
applies_to: functions between vector spaces
synonyms: [linear transformation, linear operator (for maps from a space to itself)]
levels:
  high-school:
    text: |-
      Consider a function $f$ from $\reals$ to $\reals$. The function $f$ is a _linear map_ if $f$ has the form $f(x) = m x$ for some number $m$. The graph of a linear map is a straight line that passes through the origin.
    caveat: >-
      In high school algebra, $f(x) = m x + b$ is called a "linear function," but it is a linear map only when $b = 0$. With $b \neq 0$, it is called [affine](/definitions/affine-system).
  undergraduate:
    text: |-
      Consider [vector](/definitions/vector) spaces $V$ and $W$, and a function $T : V \to W$. The function $T$ is called a _linear map_ if, for all vectors $u, v$ and scalars $c$,

      1. $T(u + v) = T(u) + T(v)$ (additivity), and
      2. $T(c v) = c T(v)$ (homogeneity).
---
