---
title: Closed set
term: closed set
applies_to: subsets of a space
levels:
  elementary:
    context: subsets of $\reals$
    text: |-
      For all [real numbers](/dictionary/definitions/real-number) $a$ and $b$ such that $a < b$, the interval of numbers between $a$ and $b$ including $a$ and $b$ is called an closed interval, and is written $[a, b]$. 

  high-school:
    context: subsets of $\reals^n$
    text: |-
      Consider a set $F$ of points on the number line, in the plane, or in space.
      The set $F$ is _closed_ if $F$ contains all of its [boundary](/dictionary/definitions/boundary) points.

  undergraduate:
    context: metric spaces
    text: |-
      Consider a set $F$ in a [metric space](/dictionary/definitions/metric-space).
      The set $F$ is _closed_ if $F$ contains the limit of every convergent [sequence](/dictionary/definitions/sequence) of points of $F$.

  graduate:
    context: topological spaces
    text: |-
      Consider a set $X$ with a [topology](/dictionary/definitions/topology).
      A set $F \subseteq X$ is _closed_ if its complement $X \setminus F$ is [open](/dictionary/definitions/open-set).

properties:
  - >-
    Every [intersection](/dictionary/definitions/set-intersection) of closed sets is closed, and every [union](/dictionary/definitions/set-union) of finitely many closed sets is closed.
    A union of infinitely many closed sets need not be closed: the union of the intervals $[1/n, 1]$ is $(0, 1]$.
  - >-
    In a [metric space](/dictionary/definitions/metric-space), the three definitions agree: a set contains its boundary points if and only if it contains the limits of its convergent sequences, if and only if its complement is open.
  - >-
    "Closed" is not the opposite of "open": a set can be both (such as $\emptyset$ and $\reals$ in $\reals$) or neither (such as $[0, 1)$).
---
