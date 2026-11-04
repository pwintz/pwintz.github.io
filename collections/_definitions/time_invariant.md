---
published: false
title: Time-invariant system
term: time-invariant
applies_to: dynamical systems
synonyms: [shift-invariant, stationary]
levels:
  elementary:
    text: |-
      Think of a recipe, or a machine, that you can start on any day.
      It is _time-invariant_ if it behaves the same way no matter when you start it: a recipe that works on Monday works just as well on Friday.
  high-school:
    text: |-
      Consider a dynamical system that can be started at different times.
      The system is _time-invariant_ if it behaves the same way no matter when you start it.
  undergraduate:
    text: |-
      Consider a system $\dot{x} = f(t, x, u)$.
      The system is _time-invariant_ if its equations do not depend explicitly on time, as in $\dot{x} = f(x, u)$.
properties:
  - >-
    Delaying the input of a time-invariant system (from the same initial state) delays its response by the same amount.
  - >-
    Any time-varying system becomes time-invariant by adding time as a state $\tau$ with $\dot{\tau} = 1$.
---
