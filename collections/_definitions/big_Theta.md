---
published: false
title: Big Theta
term: big Theta
applies_to: functions
synonyms: [$f = \Theta(g)$]
levels:
  high-school:
    text: |-
      We write $f(x) = \Theta(g(x))$, read "$f$ is _big Theta_ of $g$," to mean that for large $x$, $f(x)$ and $g(x)$ are the same size up to constant factors.
  undergraduate:
    text: |-
      We write $f(x) = \Theta(g(x))$, read "$f$ is _big Theta_ of $g$," if $f = O(g)$ and $f = \Omega(g)$: for large $x$, $c \lvert g(x) \rvert \leq \lvert f(x) \rvert \leq C \lvert g(x) \rvert$ for some constants $0 < c \leq C$.
---
