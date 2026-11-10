---
published: false
title: Periodic
term: periodic
applies_to: "functions, signals, and events"
levels:
  elementary:
    text: |-
      Think of something that happens again and again, like the seasons.
      It is _periodic_ if it repeats the same pattern at regular intervals.
  high-school:
    text: |-
      Consider a function $f$ of time $t$, and a number $T > 0$.
      The function $f$ is _periodic_ with period $T$ if

      $$f(t + T) = f(t) \quad \text{for all } t.$$

      Periodic [events](/definitions/event) happen at regular intervals of length $T$.
  undergraduate:
    context: dynamical systems
    text: |-
      Consider a solution $x(t)$ of a dynamical system.
      The solution is _periodic_ if, for some $T > 0$,

      $$x(t + T) = x(t) \quad \text{for all } t.$$
properties:
  - >-
    If $T$ is a period, then so is every positive [integer](/definitions/integer) multiple of $T$.
  - >-
    The trajectory of a nonconstant periodic solution is a closed curve, called a periodic orbit.
---
