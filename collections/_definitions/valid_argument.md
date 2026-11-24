---
published: false
title: Valid Argument
term: valid (argument)
applies_to: arguments
levels:
  high-school:
    text: |-
      An [argument](/dictionary/definitions/argument-logic) is _valid_ if its [conclusion](/dictionary/definitions/conclusion) is true in every situation in which all of its [premises](/dictionary/definitions/premise) are true.
      Validity concerns only the form of the argument, not whether the premises are true.
      For example, "All cats can fly; Tom is a cat; therefore, Tom can fly" is valid, even though its first premise is false.
  undergraduate:
    context: logic
    text: |-
      Consider an [argument](/dictionary/definitions/argument-logic) $p_1, \dots, p_n \;\therefore\; q$.
      The argument is _valid_ if every [interpretation](/dictionary/definitions/interpretation-logic) that makes all of the [premises](/dictionary/definitions/premise) $p_1, \dots, p_n$ true also makes the [conclusion](/dictionary/definitions/conclusion) $q$ true.
      This is written

      $$p_1, \; \dots, \; p_n \models q.$$
properties:
  - |-
    In [propositional logic](/dictionary/definitions/propositional-logic), the [argument](/dictionary/definitions/argument-logic) $p_1, \dots, p_n \;\therefore\; q$ is valid if and only if the formula $(p_1 \land \dots \land p_n) \implies q$ is a tautology.
  - |-
    A valid [argument](/dictionary/definitions/argument-logic) with true [premises](/dictionary/definitions/premise) has a true [conclusion](/dictionary/definitions/conclusion).
    A valid argument with a false premise can have a true or a false conclusion.
---
Logicians also call a formula _valid_ if the formula is true in every interpretation, which is the case $n = 0$ of a valid [argument](/dictionary/definitions/argument-logic).
