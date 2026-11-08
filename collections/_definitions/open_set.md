---
title: Open set
term: open set
applies_to: subsets of a space
levels:
  elementary:
    context: subsets of $\reals$
    text: |-
      For any [real numbers](/definitions/real-number) $a$ and $b$ with $a < b$, the interval of numbers strictly between $a$ and $b$ is called an open interval, and is written $(a, b)$. 

  high-school:
    context: subsets of $\reals^n$
    text: |-
      Consider a set $U$ of points on the number line, in the plane, or in space.
      The set $U$ is _open_ if every point of $U$ has a small [ball](/definitions/ball) around it that lies entirely inside $U$.

  undergraduate:
    context: metric spaces
    text: |-
      Consider a set $U$ in a [metric space](/definitions/metric-space).
      The set $U$ is _open_ if, for every point $x \in U$, there is an $\varepsilon > 0$ such that

      $$B(x, \varepsilon) \subseteq U,$$

      where $B(x, \varepsilon)$ is the [open ball](/definitions/open-ball) of radius $\varepsilon$ around $x$.
  graduate:
    context: topological spaces
    text: |-
      Consider a set $X$ with a [topology](/definitions/topology) $\mathcal{T}$.
      A set $U \subseteq X$ is _open_ if $U \in \mathcal{T}$.
properties:
  - >-
    Every [union](/definitions/set-union) of open sets is open, and every [intersection](/definitions/set-intersection) of finitely many open sets is open.
    An intersection of infinitely many open sets need not be open: the intersection of the intervals $(-1/n, 1/n)$ is $\setdef{0}$.
  - >-
    A set is open if and only if it equals its [interior](/definitions/interior), and if and only if it contains none of its [boundary](/definitions/boundary) points.
---
Being open depends on the surrounding space: $[0, 1)$ is not open in $\reals$, but it is open as a [subset](/definitions/subset) of the space $[0, \infty)$.
