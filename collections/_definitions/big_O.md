---
published: false
title: Big O
term: big O
applies_to: functions
synonyms: [$f = O(g)$]
levels:
  high-school:
    text: |-
      Consider two functions $f$ and $g$, and compare their sizes for large $x$.
      We write $f(x) = O(g(x))$ as $x \to \infty$, read "$f$ is _big O_ of $g$," to mean that for large $x$, $f(x)$ is at most a constant times $g(x)$ in size.
  undergraduate:
    text: |-
      Consider two functions $f$ and $g$.
      We write $f(x) = O(g(x))$ as $x \to \infty$, read "$f$ is _big O_ of $g$," if there exist $C > 0$ and $x_0$ such that

      $$\abs{f(x)} \leq C \abs{g(x)} \quad \text{for all } x \geq x_0.$$
      The same notation is used as $x \to a$, with "for all $x$ near $a$."
---
