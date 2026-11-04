---
published: false
title: Limit of a function
term: limit (of a function)
applies_to: functions
synonyms: [two-sided limit, '$\lim_{x \to a} f(x)$']
levels:
  high-school:
    text: |-
      Consider a function $f$ and a number $a$, and let $x$ get close to, but not equal to, $a$.
      The _limit_ of $f(x)$ as $x$ approaches $a$, written $\lim_{x \to a} f(x)$, is the number that $f(x)$ gets close to.
  undergraduate:
    text: |-
      Consider a function $f$ defined near $a$, except possibly at $a$.
      We write $\lim_{x \to a} f(x) = L$, and call $L$ the _limit_ of $f$ at $a$, if for every $\varepsilon > 0$ there is a $\delta > 0$ such that $\lvert f(x) - L \rvert < \varepsilon$ whenever $0 < \lvert x - a \rvert < \delta$.
properties:
  - |-
    The limit at $a$ exists if and only if the [left limit](/definitions/left-limit) and the [right limit](/definitions/right-limit) at $a$ both exist and are equal.
  - |-
    The value $f(a)$, and whether it is defined, does not affect the limit at $a$.
    The function $f$ is [continuous](/definitions/continuous) at $a$ when the limit equals $f(a)$.
---
