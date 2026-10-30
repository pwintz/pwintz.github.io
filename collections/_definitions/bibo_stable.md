---
published: false
title: BIBO stability
term: BIBO stable
applies_to: input-output systems
synonyms: [bounded-input bounded-output stable]
levels:
  # high-school:
  #   text: |-
  #     A control system is _BIBO stable_ (bounded-input, bounded-output stable) if its output never blows up as long as its input stays within limits.
  undergraduate:
    text: |-
      A system is _BIBO stable_ (bounded-input, bounded-output stable) if every [bounded](/definitions/bounded) input produces a bounded output, starting from the zero initial state.
properties:
  - >-
    A linear [time-invariant](/definitions/time-invariant) system is BIBO stable if and only if its impulse response is absolutely integrable. For a rational transfer function, this means every [pole](/definitions/pole) has negative real part.
  - >-
    BIBO stability does not imply internal stability: an unstable mode that is uncontrollable or unobservable does not appear in the input-output behavior.
---
