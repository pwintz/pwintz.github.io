---
published: false
title: Big Theta
term: big Theta
applies_to: functions
synonyms: [$f = \Theta(g)$]
levels:
  high-school:
    text: |-
      Consider two functions $f$ and $g$, and compare their sizes for large $x$.
      We write $f(x) = \Theta(g(x))$, read "$f$ is _big Theta_ of $g$," to mean that for large $x$, $f(x)$ and $g(x)$ are the same size up to constant factors.
  undergraduate:
    text: |-
      Consider two functions $f$ and $g$.
      We write $f(x) = \Theta(g(x))$, read "$f$ is _big Theta_ of $g$," if $f = O(g)$ and $f = \Omega(g)$: for some constants $0 < c \leq C$ and all large $x$,

      $$c \abs{g(x)} \leq \abs{f(x)} \leq C \abs{g(x)}.$$
---
