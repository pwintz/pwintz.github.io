---
published: false
title: 'The deduction of $r$ from the premises $p$, $p \implies q$, and $q \implies r$ by two applications of modus ponens'
detail: |-
  The deduction is the sequence of formulas

  1. $p$ (premise),
  2. $p \implies q$ (premise),
  3. $q$ (modus ponens from 1 and 2),
  4. $q \implies r$ (premise),
  5. $r$ (modus ponens from 3 and 4).
level: undergraduate
is: [deduction]
is_not: [argument_logic]
why:
  deduction: >-
    The sequence $p$, $p \implies q$, $q$, $q \implies r$, $r$ is a deduction of $r$, because each formula in the sequence is a premise or follows from earlier formulas by modus ponens, and the sequence ends with $r$.
  argument_logic: >-
    The sequence $p$, $p \implies q$, $q$, $q \implies r$, $r$ is not itself an argument, because the sequence lists intermediate steps; the argument that the sequence establishes is $p, \; p \implies q, \; q \implies r \;\therefore\; r$.
---
