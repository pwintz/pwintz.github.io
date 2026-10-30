---
published: false
title: Little o
term: little o
applies_to: functions
synonyms: [$f = o(g)$]
levels:
  high-school:
    text: |-
      We write $f(x) = o(g(x))$ as $x \to \infty$, read "$f$ is _little o_ of $g$," to mean that $f(x)$ becomes negligible compared with $g(x)$: the [ratio](/definitions/ratio) $f(x) / g(x)$ approaches $0$.
  undergraduate:
    text: |-
      We write $f(x) = o(g(x))$ as $x \to \infty$, read "$f$ is _little o_ of $g$," if for every $\varepsilon > 0$ there is $x_0$ with $\lvert f(x) \rvert \leq \varepsilon \lvert g(x) \rvert$ for all $x \geq x_0$.
properties:
  - >-
    When $g(x) \neq 0$ for large $x$, $f = o(g)$ if and only if $f(x) / g(x) \to 0$: $f$ is negligible compared with $g$.
  - >-
    If $f = o(g)$, then $f = O(g)$, but not conversely.
---
