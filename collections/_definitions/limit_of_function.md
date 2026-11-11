---
title: Limit of a function
term: limit (of a function)
applies_to: functions
synonyms: [two-sided limit, '$\lim_{x \to a} f(x)$']
levels:
  high-school:
    text: |-
      Consider a function $f$ and a number $a$, and let $x$ get close to, but not equal to, $a$.
      The _limit_ of $f(x)$ as $x$ approaches $a$ is the number that $f(x)$ gets close to.

      The limit of $f$ is written as 

      $$\lim_{x \to a} f(x).$$
  undergraduate:
    text: |-
      Consider a function $f$ defined near $a$, except possibly at $a$.
      We write 
      
      $$\lim_{x \to a} f(x) = L$$ 
      
      and call $L$ the _limit_ of $f$ at $a$, if for every $\varepsilon > 0$ there is a $\delta > 0$ such that

      $$\abs{f(x) - L} < \varepsilon \quad \text{whenever } 0 < \abs{x - a} < \delta.$$
properties:
  - |-
    The limit at $a$ exists if and only if the [left limit](/dictionary/definitions/left-limit) and the [right limit](/dictionary/definitions/right-limit) at $a$ both exist and are equal.
  - |-
    The value $f(a)$, and whether it is defined, does not affect the limit at $a$.
    The function $f$ is [continuous](/dictionary/definitions/continuous) at $a$ when the limit equals $f(a)$.
---
