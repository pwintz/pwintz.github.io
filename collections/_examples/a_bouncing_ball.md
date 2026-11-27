---
title: 'A bouncing ball'
level: undergraduate
is: [
  hybrid_system,
  hybrid_automaton
]
is_not: [switched_system]
why:
  switched_system: >-
    A bouncing ball is not a switched system, because the state of the system (its velocity) changes suddenly each time it hits the ground---it does not merely switch into a different mode.
  hybrid_automaton: >-
    A bouncing ball can be modeled as a hybrid automaton with one mode, whose flow is free fall and whose jump, at each impact, reverses and shrinks the velocity.
  hybrid_system: >-
    A bouncing ball is a hybrid system, because its state flows between impacts and its velocity jumps at each impact.
---
