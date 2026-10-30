---
title: Aperiodic
term: aperiodic
applies_to: "functions, signals, and events"
levels:
  elementary:
    text: |-
      We say that something occurs _aperiodically_ if the length of time between each time it happens is not always the same.
    # Something is _aperiodic_ if it does not repeat on a regular schedule.
  high-school:
    text: |-
      A function, signal, or sequence of events is _aperiodic_ if it is not [periodic](/definitions/periodic).
  undergraduate:
    context: real-time systems
    text: |-
      A sequence of times $t_1$, $t_2$, $t_3$, ... is called _aperiodic_ if there does not exist a constant $P > 0$ such that $t_{i + 1} - t_{i} = P$ for each $i = 1, 2, 3, \dots$.
    # TODO: Also define a periodic functions.
    # _Aperiodic_ events (or tasks) can occur at any time, with no guaranteed minimum separation between occurrences.
---
