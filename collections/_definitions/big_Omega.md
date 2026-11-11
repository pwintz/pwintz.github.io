---
published: false
title: Big Omega
term: big Omega
applies_to: functions
synonyms: [$f = \Omega(g)$]
levels:
  high-school:
    text: |-
      Consider two functions $f$ and $g$, and compare their sizes for large $x$.
      We write $f(x) = \Omega(g(x))$ as $x \to \infty$, read "$f$ is _big Omega_ of $g$," to mean that for large $x$, $f(x)$ is at least a constant times $g(x)$ in size.
  undergraduate:
    context: "computer science (Knuth's definition)"
    text: |-
      Consider two functions $f$ and $g$.
      We write $f(x) = \Omega(g(x))$ as $x \to \infty$, read "$f$ is _big Omega_ of $g$," if there exist $c > 0$ and $x_0$ such that

      $$\abs{f(x)} \geq c \abs{g(x)} \quad \text{for all } x \geq x_0.$$
properties:
  - >-
    In Knuth's sense, $f = \Omega(g)$ if and only if $g = O(f)$.
---
In [analytic](/dictionary/definitions/analytic) number theory, $f = \Omega(g)$ has an older meaning (Hardy and Littlewood): $f$ is _not_ $o(g)$, so $\abs{f} \geq c \abs{g}$ only for arbitrarily large $x$, not for all large $x$.
