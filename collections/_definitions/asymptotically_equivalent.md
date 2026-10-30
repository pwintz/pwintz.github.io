---
title: Asymptotically equivalent
term: asymptotically equivalent
applies_to: functions
synonyms: [$f \sim g$]
levels:
  high-school:
    text: |-
      Functions $f$ and $g$ are _asymptotically equivalent_ as $x \to \infty$ if their [ratio](/definitions/ratio) $f(x) / g(x)$ approaches $1$, so that they are nearly equal in relative terms for large $x$.
  undergraduate:
    text: |-
      Functions $f$ and $g$ are _asymptotically equivalent_ as $x \to \infty$, written $f(x) \sim g(x)$, if $$\lim_{x \to \infty} f(x) / g(x) = 1.$$
properties:
  - >-
    If $f \sim g$, then $f = \Theta(g)$, but not conversely.
  - >-
    $f \sim g$ if and only if $f - g = o(g)$.
---
